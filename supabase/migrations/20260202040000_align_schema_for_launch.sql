-- ============================================
-- Migration 4: Align DB schema with code for launch
-- Adds missing columns, fixes conflicts, enforces limits
-- ============================================

-- ============================================
-- 1. PROFILES: Add missing columns
-- ============================================

-- Stripe customer ID for payments
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Track if user has paid for publishing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT false;

-- ============================================
-- 2. PORTFOLIOS: Add missing columns to match DbPortfolio
-- ============================================

-- Template family (crimson, arctic, noir, etc.)
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS template_family TEXT DEFAULT 'crimson';

-- Make username nullable (new portfolios don't have one yet)
ALTER TABLE public.portfolios ALTER COLUMN username DROP NOT NULL;
ALTER TABLE public.portfolios ALTER COLUMN username SET DEFAULT NULL;

-- Avatar URL
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Highlights array
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- Bio (separate from tagline)
-- Already exists in initial schema, but ensure it's there
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Calendly link
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS calendly TEXT;

-- Rename tech_stack → skills (keep both for backward compat)
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

-- Copy existing tech_stack data to skills if skills is empty
UPDATE public.portfolios
SET skills = tech_stack
WHERE skills = '[]'::jsonb AND tech_stack IS NOT NULL AND tech_stack != '[]'::jsonb;

-- Seeking fields (code uses is_seeking + seeking_*, schema has is_seeking_lia + lia_*)
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS is_seeking BOOLEAN DEFAULT false;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_type TEXT CHECK (seeking_type IN ('lia', 'job', 'freelance'));

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_title TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_description TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_period TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_location TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seeking_interests JSONB DEFAULT '[]'::jsonb;

-- Migrate old lia fields → new seeking fields (lia_location does not exist, skip it)
UPDATE public.portfolios
SET
    is_seeking = COALESCE(is_seeking_lia, false),
    seeking_type = CASE WHEN is_seeking_lia = true THEN 'lia' ELSE NULL END,
    seeking_period = lia_period,
    seeking_interests = COALESCE(lia_interests, '[]'::jsonb)
WHERE is_seeking = false AND is_seeking_lia = true;

-- Show CV download toggle
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS show_cv_download BOOLEAN DEFAULT true;

-- SEO fields
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seo_title TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS seo_description TEXT;

ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Language
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'sv' CHECK (language IN ('sv', 'en'));

-- ============================================
-- 3. CVS: Add missing columns
-- ============================================

-- Portfolio reference
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL;

-- Name field for the CV
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Mitt CV';

-- Separate contact fields (instead of jsonb personal_info)
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS website TEXT;

-- Projects and settings
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"primary_color": "#1a1a2e", "show_photo": false, "page_size": "a4", "font_size": "medium"}'::jsonb;

-- ============================================
-- 4. ENFORCE 1 PORTFOLIO + 1 CV PER USER
-- ============================================

-- Create unique partial index: max 1 non-deleted/non-archived portfolio per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_portfolio_per_user
ON public.portfolios(user_id)
WHERE status != 'archived';

-- Create unique index: max 1 CV per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_cv_per_user
ON public.cvs(user_id);

-- ============================================
-- 5. CREDIT TRANSACTIONS TABLE (for audit trail)
-- ============================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'publish', 'edit', 'refund', 'credit_purchase')),
    description TEXT,
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);

-- RLS for credit_transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions" ON public.credit_transactions
    FOR INSERT WITH CHECK (true);

-- ============================================
-- 6. UPDATED PUBLISH FUNCTION (with payment check)
-- ============================================

CREATE OR REPLACE FUNCTION public.publish_portfolio(p_portfolio_id UUID, p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_has_paid BOOLEAN;
BEGIN
    -- Get user_id from portfolio
    SELECT user_id INTO v_user_id
    FROM public.portfolios
    WHERE id = p_portfolio_id;

    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check payment status
    SELECT has_paid INTO v_has_paid
    FROM public.profiles
    WHERE id = v_user_id;

    IF NOT COALESCE(v_has_paid, false) THEN
        RETURN FALSE;
    END IF;

    -- Claim username first
    IF NOT public.check_username_available(p_username) THEN
        RETURN FALSE;
    END IF;

    -- Update username and publish
    UPDATE public.portfolios
    SET username = p_username,
        status = 'published',
        published_at = NOW()
    WHERE id = p_portfolio_id;

    RETURN TRUE;
END;
$$;

-- ============================================
-- 7. FUNCTION: Mark user as paid
-- ============================================

CREATE OR REPLACE FUNCTION public.mark_user_paid(p_user_id UUID, p_stripe_customer_id TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET has_paid = true,
        stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id)
    WHERE id = p_user_id;
END;
$$;

-- ============================================
-- 8. FUNCTION: Add credits to user
-- ============================================

CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INTEGER, p_stripe_pi TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_credits INTEGER;
BEGIN
    UPDATE public.profiles
    SET credits = credits + p_amount
    WHERE id = p_user_id
    RETURNING credits INTO v_new_credits;

    -- Log transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, stripe_payment_intent_id)
    VALUES (p_user_id, p_amount, 'purchase', p_amount || ' credits köpta', p_stripe_pi);

    RETURN v_new_credits;
END;
$$;

-- ============================================
-- 9. FUNCTION: Use credits (for edits)
-- ============================================

CREATE OR REPLACE FUNCTION public.use_credits(p_user_id UUID, p_amount INTEGER, p_description TEXT DEFAULT 'Ändring')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_credits INTEGER;
BEGIN
    SELECT credits INTO v_current_credits FROM public.profiles WHERE id = p_user_id;

    IF v_current_credits < p_amount THEN
        RETURN FALSE;
    END IF;

    UPDATE public.profiles SET credits = credits - p_amount WHERE id = p_user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (p_user_id, -p_amount, 'edit', p_description);

    RETURN TRUE;
END;
$$;
