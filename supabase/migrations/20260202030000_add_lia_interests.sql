-- Add missing lia_interests column to portfolios table
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS lia_interests JSONB DEFAULT '[]'::jsonb;
