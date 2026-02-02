import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy initialization to avoid build-time errors when env vars are missing
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!_supabase) {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase environment variables are not configured');
        }
        _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        const client = getSupabaseClient();
        const value = client[prop as keyof SupabaseClient];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    }
});

// Database types based on schema
export interface DbProfile {
    id: string;
    username: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    tier: 'free' | 'standard' | 'premium';
    credits: number;
    created_at: string;
    updated_at: string;
}

export interface DbPortfolio {
    id: string;
    user_id: string;
    username: string;
    template_id: string;
    title: string;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
    tech_stack: any[];
    projects: any[];
    timeline: any[];
    highlights: any[];
    theme: Record<string, any>;
    is_published: boolean;
    is_seeking_lia: boolean;
    lia_period: string | null;
    lia_location: string | null;
    lia_interests: string[];
    created_at: string;
    updated_at: string;
}

export interface DbAnalytics {
    id: string;
    portfolio_id: string;
    total_views: number;
    unique_visitors: number;
    cv_downloads: number;
    contact_clicks: number;
    last_viewed_at: string | null;
}

// Portfolio functions
export async function getPortfolioByUsername(username: string): Promise<DbPortfolio | null> {
    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('is_published', true)
        .single();

    if (error || !data) return null;
    return data;
}

export async function getUserPortfolios(userId: string): Promise<DbPortfolio[]> {
    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
}

export async function createPortfolio(portfolio: Partial<DbPortfolio>): Promise<DbPortfolio | null> {
    const { data, error } = await supabase
        .from('portfolios')
        .insert(portfolio)
        .select()
        .single();

    if (error) {
        console.error('Error creating portfolio:', error);
        return null;
    }
    return data;
}

export async function updatePortfolio(id: string, updates: Partial<DbPortfolio>): Promise<DbPortfolio | null> {
    const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating portfolio:', error);
        return null;
    }
    return data;
}

export async function publishPortfolio(id: string, username: string): Promise<boolean> {
    const { error } = await supabase
        .from('portfolios')
        .update({ is_published: true, username: username.toLowerCase() })
        .eq('id', id);

    return !error;
}

export async function unpublishPortfolio(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('portfolios')
        .update({ is_published: false })
        .eq('id', id);

    return !error;
}

export async function deletePortfolio(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

    return !error;
}

// Analytics functions
export async function trackPortfolioView(portfolioId: string): Promise<void> {
    // First, try to get existing analytics
    const { data: existing } = await supabase
        .from('portfolio_analytics')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .single();

    if (existing) {
        // Update existing
        await supabase
            .from('portfolio_analytics')
            .update({
                total_views: existing.total_views + 1,
                last_viewed_at: new Date().toISOString(),
            })
            .eq('portfolio_id', portfolioId);
    } else {
        // Create new
        await supabase
            .from('portfolio_analytics')
            .insert({
                portfolio_id: portfolioId,
                total_views: 1,
                unique_visitors: 1,
                cv_downloads: 0,
                contact_clicks: 0,
                last_viewed_at: new Date().toISOString(),
            });
    }
}

export async function trackCvDownload(portfolioId: string): Promise<void> {
    await supabase
        .from('portfolio_analytics')
        .update({ cv_downloads: supabase.rpc('increment_cv_downloads', { portfolio_id: portfolioId }) })
        .eq('portfolio_id', portfolioId);
}

export async function trackContactClick(portfolioId: string): Promise<void> {
    await supabase
        .from('portfolio_analytics')
        .update({ contact_clicks: supabase.rpc('increment_contact_clicks', { portfolio_id: portfolioId }) })
        .eq('portfolio_id', portfolioId);
}

export async function getPortfolioAnalytics(portfolioId: string): Promise<DbAnalytics | null> {
    const { data } = await supabase
        .from('portfolio_analytics')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .single();

    return data || null;
}

// Profile functions
export async function getProfile(userId: string): Promise<DbProfile | null> {
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return data || null;
}

export async function updateProfile(userId: string, updates: Partial<DbProfile>): Promise<boolean> {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    return !error;
}

// Check if username is available
export async function isUsernameAvailable(username: string): Promise<boolean> {
    const { data } = await supabase
        .from('portfolios')
        .select('id')
        .eq('username', username.toLowerCase())
        .eq('is_published', true)
        .single();

    return !data;
}
