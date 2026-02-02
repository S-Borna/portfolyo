-- ============================================
-- Fix portfolios schema - Add missing columns
-- Run after initial schema if columns don't exist
-- ============================================

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add status column if not exists (safe for existing data)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'portfolios' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.portfolios ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
END $$;

-- Add published_at column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'portfolios' 
                   AND column_name = 'published_at') THEN
        ALTER TABLE public.portfolios ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add is_published generated column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'portfolios' 
                   AND column_name = 'is_published') THEN
        ALTER TABLE public.portfolios ADD COLUMN is_published BOOLEAN GENERATED ALWAYS AS (status = 'published') STORED;
    END IF;
END $$;

-- Create index on status (safe, IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);

-- Create portfolio_analytics table if not exists
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    cv_downloads INTEGER DEFAULT 0,
    link_clicks INTEGER DEFAULT 0,
    UNIQUE(portfolio_id, date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_portfolio ON public.portfolio_analytics(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.portfolio_analytics(date);

-- Create portfolio_views table for visitor tracking
CREATE TABLE IF NOT EXISTS public.portfolio_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    visitor_hash TEXT NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    referrer TEXT,
    user_agent TEXT,
    country TEXT
);

CREATE INDEX IF NOT EXISTS idx_views_portfolio ON public.portfolio_views(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_views_hash ON public.portfolio_views(visitor_hash);

-- Function: Track portfolio view
CREATE OR REPLACE FUNCTION public.track_portfolio_view(
    p_portfolio_id UUID,
    p_visitor_hash TEXT,
    p_referrer TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_new_visitor BOOLEAN;
BEGIN
    -- Check if this visitor has viewed before today
    SELECT NOT EXISTS(
        SELECT 1 FROM public.portfolio_views 
        WHERE portfolio_id = p_portfolio_id 
        AND visitor_hash = p_visitor_hash
        AND viewed_at > CURRENT_DATE
    ) INTO is_new_visitor;

    -- Record view
    INSERT INTO public.portfolio_views (portfolio_id, visitor_hash, referrer, user_agent)
    VALUES (p_portfolio_id, p_visitor_hash, p_referrer, p_user_agent);

    -- Update analytics
    INSERT INTO public.portfolio_analytics (portfolio_id, date, views, unique_visitors)
    VALUES (p_portfolio_id, CURRENT_DATE, 1, CASE WHEN is_new_visitor THEN 1 ELSE 0 END)
    ON CONFLICT (portfolio_id, date) DO UPDATE
    SET views = portfolio_analytics.views + 1,
        unique_visitors = portfolio_analytics.unique_visitors + CASE WHEN is_new_visitor THEN 1 ELSE 0 END;
END;
$$;

-- Function: Check username availability
CREATE OR REPLACE FUNCTION public.check_username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check reserved words
    IF p_username IN ('admin', 'api', 'www', 'app', 'dashboard', 'login', 'register', 'portfolio', 'cv', 'help', 'support', 'blog', 'about', 'contact', 'pricing', 'terms', 'privacy') THEN
        RETURN FALSE;
    END IF;
    
    -- Check if already taken
    RETURN NOT EXISTS(SELECT 1 FROM public.portfolios WHERE username = p_username);
END;
$$;

-- Function: Claim username for portfolio
CREATE OR REPLACE FUNCTION public.claim_username(p_portfolio_id UUID, p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify available
    IF NOT public.check_username_available(p_username) THEN
        RETURN FALSE;
    END IF;
    
    -- Claim it
    UPDATE public.portfolios 
    SET username = p_username
    WHERE id = p_portfolio_id;
    
    RETURN TRUE;
END;
$$;

-- Function: Publish portfolio
CREATE OR REPLACE FUNCTION public.publish_portfolio(p_portfolio_id UUID, p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Claim username first
    IF NOT public.claim_username(p_portfolio_id, p_username) THEN
        RETURN FALSE;
    END IF;
    
    -- Publish
    UPDATE public.portfolios 
    SET status = 'published', published_at = NOW()
    WHERE id = p_portfolio_id;
    
    RETURN TRUE;
END;
$$;

-- RLS Policies (safe to run multiple times with IF NOT EXISTS pattern)
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;

-- Analytics: Users can view their own analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON public.portfolio_analytics;
CREATE POLICY "Users can view own analytics" ON public.portfolio_analytics
    FOR SELECT USING (
        portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid())
    );

-- Views: Service role only for tracking
DROP POLICY IF EXISTS "Service role can insert views" ON public.portfolio_views;
CREATE POLICY "Service role can insert views" ON public.portfolio_views
    FOR INSERT WITH CHECK (true);
