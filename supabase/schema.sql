-- Supabase Database Schema for PL0 (Prompt Layer Zero)
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
    monthly_deconstructions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table - stores raw user ideas
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    raw_idea TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deconstructions table - stores analysis results
CREATE TABLE IF NOT EXISTS public.deconstructions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    category TEXT,
    product_name_suggestion TEXT,
    real_problem TEXT,
    target_user TEXT,
    complexity_score INTEGER CHECK (complexity_score >= 1 AND complexity_score <= 10),
    rebuild_risk_percentage INTEGER CHECK (rebuild_risk_percentage >= 0 AND rebuild_risk_percentage <= 100),
    full_analysis JSONB NOT NULL, -- Stores the complete DeconstructionResult
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scope alternatives table
CREATE TABLE IF NOT EXISTS public.scope_alternatives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deconstruction_id UUID REFERENCES public.deconstructions(id) ON DELETE CASCADE,
    alternatives JSONB NOT NULL, -- Stores ScopeCollapseResult
    selected_alternative_id INTEGER, -- Which alternative the user selected (1, 2, or 3)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated prompts table
CREATE TABLE IF NOT EXISTS public.generated_prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deconstruction_id UUID REFERENCES public.deconstructions(id) ON DELETE CASCADE,
    scope_alternative_id UUID REFERENCES public.scope_alternatives(id) ON DELETE SET NULL,
    target_tool TEXT NOT NULL CHECK (target_tool IN ('lovable', 'v0', 'cursor', 'chatgpt', 'claude', 'generic')),
    variant TEXT NOT NULL CHECK (variant IN ('safe', 'balanced', 'ambitious')),
    prompt_title TEXT,
    prompt_text TEXT NOT NULL,
    word_count INTEGER,
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    quality_breakdown JSONB,
    full_prompt_data JSONB, -- Stores complete SynthesizedPrompt
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('deconstruction', 'scope_collapse', 'prompt_synthesis', 'quality_score')),
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_deconstructions_idea_id ON public.deconstructions(idea_id);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_deconstruction_id ON public.generated_prompts(deconstruction_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deconstructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON public.ideas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create ideas" ON public.ideas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON public.ideas
    FOR DELETE USING (auth.uid() = user_id);

-- Deconstructions policies
CREATE POLICY "Users can view own deconstructions" ON public.deconstructions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ideas
            WHERE ideas.id = deconstructions.idea_id
            AND ideas.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create deconstructions for own ideas" ON public.deconstructions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ideas
            WHERE ideas.id = idea_id
            AND ideas.user_id = auth.uid()
        )
    );

-- Scope alternatives policies
CREATE POLICY "Users can view own scope alternatives" ON public.scope_alternatives
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.deconstructions d
            JOIN public.ideas i ON i.id = d.idea_id
            WHERE d.id = scope_alternatives.deconstruction_id
            AND i.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create scope alternatives" ON public.scope_alternatives
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.deconstructions d
            JOIN public.ideas i ON i.id = d.idea_id
            WHERE d.id = deconstruction_id
            AND i.user_id = auth.uid()
        )
    );

-- Generated prompts policies
CREATE POLICY "Users can view own prompts" ON public.generated_prompts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.deconstructions d
            JOIN public.ideas i ON i.id = d.idea_id
            WHERE d.id = generated_prompts.deconstruction_id
            AND i.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create prompts" ON public.generated_prompts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.deconstructions d
            JOIN public.ideas i ON i.id = d.idea_id
            WHERE d.id = deconstruction_id
            AND i.user_id = auth.uid()
        )
    );

-- Usage logs policies
CREATE POLICY "Users can view own usage" ON public.usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create usage logs" ON public.usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update monthly deconstruction count
CREATE OR REPLACE FUNCTION public.increment_deconstruction_count(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET monthly_deconstructions = monthly_deconstructions + 1,
        updated_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly counts (run via cron job)
CREATE OR REPLACE FUNCTION public.reset_monthly_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET monthly_deconstructions = 0,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
    p.id AS user_id,
    p.subscription_tier,
    p.monthly_deconstructions,
    COUNT(DISTINCT i.id) AS total_ideas,
    COUNT(DISTINCT d.id) AS total_deconstructions,
    COUNT(DISTINCT gp.id) AS total_prompts,
    MAX(gp.created_at) AS last_activity
FROM public.profiles p
LEFT JOIN public.ideas i ON i.user_id = p.id
LEFT JOIN public.deconstructions d ON d.idea_id = i.id
LEFT JOIN public.generated_prompts gp ON gp.deconstruction_id = d.id
GROUP BY p.id, p.subscription_tier, p.monthly_deconstructions;
