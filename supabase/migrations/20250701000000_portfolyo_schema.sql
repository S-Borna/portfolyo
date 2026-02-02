-- ============================================
-- PORTFOLYO.SE - Database Schema
-- Enterprise-grade portfolio & CV platform
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'premium')),
    credits INTEGER DEFAULT 5,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT UNIQUE, -- username.portfolyo.se

    -- Template
    template_id TEXT NOT NULL DEFAULT 'crimson-dark',
    template_family TEXT NOT NULL DEFAULT 'crimson',

    -- Profile
    title TEXT NOT NULL, -- Full name
    tagline TEXT, -- Professional title
    bio TEXT,
    avatar_url TEXT,
    location TEXT,

    -- Contact
    email TEXT,
    phone TEXT,
    website TEXT,
    github TEXT,
    linkedin TEXT,
    calendly TEXT,

    -- Content (JSONB for flexibility)
    highlights JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,

    -- LIA/Seeking section
    is_seeking BOOLEAN DEFAULT false,
    seeking_type TEXT, -- 'lia', 'job', 'freelance'
    seeking_title TEXT,
    seeking_description TEXT,
    seeking_period TEXT,
    seeking_location TEXT,
    seeking_interests JSONB DEFAULT '[]'::jsonb,

    -- Settings
    theme JSONB DEFAULT '{}'::jsonb,
    language TEXT DEFAULT 'sv' CHECK (language IN ('sv', 'en')),
    show_cv_download BOOLEAN DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,

    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_published BOOLEAN GENERATED ALWAYS AS (status = 'published') STORED,
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_username ON public.portfolios(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);

-- CVs
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,

    -- Template
    template_id TEXT NOT NULL DEFAULT 'modern-dark',

    -- Personal info
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    linkedin TEXT,
    github TEXT,
    website TEXT,

    -- Content
    summary TEXT,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,

    -- Settings
    settings JSONB DEFAULT '{
        "primaryColor": "#0a0a0a",
        "showPhoto": false,
        "pageSize": "a4",
        "fontSize": "medium"
    }'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_portfolio_id ON public.cvs(portfolio_id);

-- Analytics
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    cv_downloads INTEGER DEFAULT 0,
    contact_clicks INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_portfolio_id ON public.portfolio_analytics(portfolio_id);

-- View tracking (for unique visitors)
CREATE TABLE IF NOT EXISTS public.portfolio_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    visitor_hash TEXT NOT NULL, -- SHA256 of IP + user agent
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_views_portfolio_id ON public.portfolio_views(portfolio_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_views_unique ON public.portfolio_views(portfolio_id, visitor_hash);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios" ON public.portfolios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published portfolios" ON public.portfolios
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create portfolios" ON public.portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON public.portfolios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON public.portfolios
    FOR DELETE USING (auth.uid() = user_id);

-- CVs policies
CREATE POLICY "Users can view own CVs" ON public.cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create CVs" ON public.cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs" ON public.cvs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs" ON public.cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies (read-only for owners)
CREATE POLICY "Users can view own analytics" ON public.portfolio_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE portfolios.id = portfolio_analytics.portfolio_id
            AND portfolios.user_id = auth.uid()
        )
    );

-- Views can be inserted by anyone (for tracking)
CREATE POLICY "Anyone can insert views" ON public.portfolio_views
    FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cvs_updated_at
    BEFORE UPDATE ON public.cvs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Track portfolio view (handles both insert and increment)
CREATE OR REPLACE FUNCTION public.track_portfolio_view(
    p_portfolio_id UUID,
    p_visitor_hash TEXT
)
RETURNS VOID AS $$
DECLARE
    is_new_visitor BOOLEAN;
BEGIN
    -- Try to insert new view (will fail if duplicate)
    INSERT INTO public.portfolio_views (portfolio_id, visitor_hash)
    VALUES (p_portfolio_id, p_visitor_hash)
    ON CONFLICT (portfolio_id, visitor_hash) DO NOTHING
    RETURNING TRUE INTO is_new_visitor;

    -- Update analytics
    INSERT INTO public.portfolio_analytics (portfolio_id, total_views, unique_visitors, last_viewed_at)
    VALUES (p_portfolio_id, 1, CASE WHEN is_new_visitor THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (portfolio_id) DO UPDATE
    SET
        total_views = portfolio_analytics.total_views + 1,
        unique_visitors = portfolio_analytics.unique_visitors + CASE WHEN is_new_visitor THEN 1 ELSE 0 END,
        last_viewed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment CV downloads
CREATE OR REPLACE FUNCTION public.track_cv_download(p_portfolio_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.portfolio_analytics
    SET cv_downloads = cv_downloads + 1
    WHERE portfolio_id = p_portfolio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check username availability
CREATE OR REPLACE FUNCTION public.check_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.portfolios WHERE username = LOWER(p_username)
    ) AND NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE username = LOWER(p_username)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Claim username
CREATE OR REPLACE FUNCTION public.claim_username(
    p_user_id UUID,
    p_username TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    is_available BOOLEAN;
BEGIN
    -- Check availability
    SELECT public.check_username_available(p_username) INTO is_available;

    IF NOT is_available THEN
        RETURN FALSE;
    END IF;

    -- Update profile
    UPDATE public.profiles
    SET username = LOWER(p_username)
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Publish portfolio with username
CREATE OR REPLACE FUNCTION public.publish_portfolio(
    p_portfolio_id UUID,
    p_username TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    is_available BOOLEAN;
    v_user_id UUID;
BEGIN
    -- Get user_id
    SELECT user_id INTO v_user_id FROM public.portfolios WHERE id = p_portfolio_id;

    -- Check username availability
    SELECT public.check_username_available(p_username) INTO is_available;

    IF NOT is_available THEN
        -- Check if user already owns this username
        IF NOT EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE username = LOWER(p_username)
            AND user_id = v_user_id
        ) THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- Update portfolio
    UPDATE public.portfolios
    SET
        username = LOWER(p_username),
        status = 'published',
        published_at = COALESCE(published_at, NOW())
    WHERE id = p_portfolio_id;

    -- Create analytics record if not exists
    INSERT INTO public.portfolio_analytics (portfolio_id)
    VALUES (p_portfolio_id)
    ON CONFLICT (portfolio_id) DO NOTHING;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
