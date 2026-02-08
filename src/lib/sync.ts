// ============================================
// PORTFOLYO.SE - Supabase Sync
// Synkronisering mellan Zustand och Supabase
// ============================================

import { supabase } from './supabase';
import { usePortfolyoStore } from './store';
import type { User } from './types';

// ============================================
// TYPES
// ============================================

export interface SyncResult {
    success: boolean;
    error?: string;
}

export interface SyncOptions {
    /** Force sync even if data seems up-to-date */
    force?: boolean;
}

// ============================================
// AUTH SYNC
// ============================================

/**
 * Synkronisera användardata från Supabase till Zustand
 * Anropas vid inloggning och app-start
 */
export async function syncUserFromSupabase(): Promise<SyncResult> {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            // Ingen session - logga ut från store
            usePortfolyoStore.getState().logout();
            return { success: true };
        }

        // Hämta profil från database
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            return { success: false, error: 'Kunde inte hämta profil' };
        }

        // Konvertera till User-typ och uppdatera store
        const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || '',
            plan: profile.tier as 'free' | 'starter' | 'pro',
            credits: profile.credits || 0,
            creditsUsed: 0, // TODO: Track this in database
            stripeCustomerId: profile.stripe_customer_id,
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at),
        };

        usePortfolyoStore.getState().login(user);

        return { success: true };
    } catch (error) {
        console.error('Sync error:', error);
        return { success: false, error: 'Synkroniseringsfel' };
    }
}

// ============================================
// PORTFOLIO SYNC
// ============================================

/**
 * Synkronisera portfolios från Supabase till Zustand
 */
export async function syncPortfoliosFromSupabase(): Promise<SyncResult> {
    try {
        const user = usePortfolyoStore.getState().user;
        if (!user) {
            return { success: false, error: 'Inte inloggad' };
        }

        const { data: portfolios, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching portfolios:', error);
            return { success: false, error: 'Kunde inte hämta portfolios' };
        }

        // Konvertera DB-portfolios till Zustand-format och uppdatera store
        if (portfolios && portfolios.length > 0) {
            const store = usePortfolyoStore.getState();
            const convertedPortfolios = portfolios.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                slug: p.username || '',
                template: p.template_id || 'developer',
                customDomain: undefined,
                profile: {
                    fullName: p.title || '',
                    title: p.tagline || '',
                    tagline: p.tagline || '',
                    bio: p.bio || '',
                    avatar: p.avatar_url || undefined,
                    location: p.location || undefined,
                    highlights: p.highlights || [],
                    seeking: p.is_seeking ? (p.seeking_type || 'lia') : undefined,
                    seekingDetails: p.is_seeking ? {
                        type: p.seeking_type || 'lia',
                        period: p.seeking_period || p.lia_period || '',
                        location: p.seeking_location || p.lia_location || '',
                        interests: p.seeking_interests || p.lia_interests || [],
                    } : undefined,
                },
                projects: (p.projects || []).map((proj: any) => ({
                    id: proj.id || crypto.randomUUID(),
                    name: proj.name || '',
                    description: proj.description || '',
                    tags: proj.tags || [],
                    links: proj.links || { live: proj.url },
                    featured: proj.featured || false,
                    order: proj.order || 0,
                })),
                timeline: (p.timeline || []).map((t: any) => ({
                    id: t.id || crypto.randomUUID(),
                    title: t.title || '',
                    subtitle: t.subtitle || t.organization || '',
                    description: t.description || '',
                    period: t.period || `${t.startDate || ''} – ${t.endDate || 'Pågående'}`,
                    type: t.type || 'education',
                    current: t.current || false,
                    achievements: t.achievements || [],
                    tags: t.tags || [],
                    order: t.order || 0,
                })),
                techStack: (p.skills || p.tech_stack || []).map((s: any) =>
                    typeof s === 'string'
                        ? { name: s, icon: s.toLowerCase().replace(/[.\s]/g, ''), category: 'tools', proficiency: 'intermediate' }
                        : { name: s.name, icon: s.icon || s.name?.toLowerCase(), category: s.category || 'tools', proficiency: s.proficiency || 'intermediate' }
                ),
                contact: {
                    email: p.email || '',
                    phone: p.phone || undefined,
                    linkedin: p.linkedin || undefined,
                    github: p.github || undefined,
                    website: p.website || undefined,
                    calendly: p.calendly || undefined,
                    showContactForm: true,
                },
                settings: {
                    primaryColor: p.theme?.accent_color || '#8B5CF6',
                    accentColor: p.theme?.accent_color || '#6366F1',
                    fontFamily: 'inter' as const,
                    darkMode: p.theme?.dark_mode !== false,
                    showAnalytics: false,
                },
                analytics: {
                    totalViews: 0,
                    uniqueVisitors: 0,
                    cvDownloads: 0,
                    contactClicks: 0,
                },
                status: p.status || (p.is_published ? 'published' : 'draft'),
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at),
                publishedAt: p.published_at ? new Date(p.published_at) : undefined,
            }));

            // Replace portfolios in store
            usePortfolyoStore.setState({
                portfolios: convertedPortfolios,
                activePortfolioId: convertedPortfolios[0]?.id || null,
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Portfolio sync error:', error);
        return { success: false, error: 'Synkroniseringsfel' };
    }
}

/**
 * Spara portfolio till Supabase
 */
export async function savePortfolioToSupabase(portfolioId: string): Promise<SyncResult> {
    try {
        const store = usePortfolyoStore.getState();
        const portfolio = store.portfolios.find(p => p.id === portfolioId);

        if (!portfolio) {
            return { success: false, error: 'Portfolio hittades inte' };
        }

        // Konvertera till database-format
        const dbPortfolio = {
            id: portfolio.id,
            user_id: portfolio.userId,
            username: portfolio.slug,
            template_id: portfolio.template,
            title: portfolio.profile.fullName,
            tagline: portfolio.profile.tagline,
            bio: portfolio.profile.bio,
            location: portfolio.profile.location,
            avatar_url: portfolio.profile.avatar,
            email: portfolio.contact.email,
            phone: portfolio.contact.phone,
            website: portfolio.contact.website,
            github: portfolio.contact.github,
            linkedin: portfolio.contact.linkedin,
            skills: portfolio.techStack.map(t => ({ name: t.name, icon: t.icon, category: t.category, proficiency: t.proficiency })),
            projects: portfolio.projects,
            timeline: portfolio.timeline,
            highlights: portfolio.profile.highlights,
            theme: {
                accent_color: portfolio.settings.primaryColor || portfolio.settings.accentColor,
                dark_mode: portfolio.settings.darkMode,
            },
            status: portfolio.status,
            is_seeking: !!portfolio.profile.seeking,
            seeking_type: portfolio.profile.seekingDetails?.type,
            seeking_period: portfolio.profile.seekingDetails?.period,
            seeking_location: portfolio.profile.seekingDetails?.location,
            seeking_interests: portfolio.profile.seekingDetails?.interests || [],
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('portfolios')
            .upsert(dbPortfolio);

        if (error) {
            console.error('Error saving portfolio:', error);
            return { success: false, error: 'Kunde inte spara portfolio' };
        }

        return { success: true };
    } catch (error) {
        console.error('Save portfolio error:', error);
        return { success: false, error: 'Sparningsfel' };
    }
}

// ============================================
// CV SYNC
// ============================================

/**
 * Synkronisera CVs från Supabase till Zustand
 */
export async function syncCVsFromSupabase(): Promise<SyncResult> {
    try {
        const user = usePortfolyoStore.getState().user;
        if (!user) {
            return { success: false, error: 'Inte inloggad' };
        }

        const { data: cvs, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching CVs:', error);
            return { success: false, error: 'Kunde inte hämta CVs' };
        }

        if (cvs && cvs.length > 0) {
            const convertedCVs = cvs.map((c: any) => ({
                id: c.id,
                userId: c.user_id,
                portfolioId: c.portfolio_id,
                name: c.name || 'Mitt CV',
                template: c.template_id || 'modern',
                personalInfo: {
                    fullName: c.full_name || '',
                    title: c.title || '',
                    email: c.email || '',
                    phone: c.phone,
                    location: c.location,
                    linkedin: c.linkedin,
                    github: c.github,
                    website: c.website,
                },
                summary: c.summary || '',
                experience: c.experience || [],
                education: c.education || [],
                skills: c.skills || [],
                languages: c.languages || [],
                certifications: c.certifications || [],
                projects: c.projects || [],
                settings: {
                    primaryColor: c.settings?.primary_color || '#8B5CF6',
                    showPhoto: c.settings?.show_photo ?? false,
                    pageSize: c.settings?.page_size || 'a4',
                    fontSize: c.settings?.font_size || 'medium',
                },
                createdAt: new Date(c.created_at),
                updatedAt: new Date(c.updated_at),
            }));

            usePortfolyoStore.setState({ cvs: convertedCVs });
        }

        return { success: true };
    } catch (error) {
        console.error('CV sync error:', error);
        return { success: false, error: 'Synkroniseringsfel' };
    }
}

/**
 * Spara CV till Supabase
 */
export async function saveCVToSupabase(cvId: string): Promise<SyncResult> {
    try {
        const store = usePortfolyoStore.getState();
        const cv = store.cvs.find(c => c.id === cvId);

        if (!cv) {
            return { success: false, error: 'CV hittades inte' };
        }

        // Konvertera till database-format
        const dbCV = {
            id: cv.id,
            user_id: cv.userId,
            template_id: cv.template,
            name: cv.name,
            full_name: cv.personalInfo.fullName,
            title: cv.personalInfo.title,
            email: cv.personalInfo.email,
            phone: cv.personalInfo.phone,
            location: cv.personalInfo.location,
            linkedin: cv.personalInfo.linkedin,
            github: cv.personalInfo.github,
            website: cv.personalInfo.website,
            summary: cv.summary,
            experience: cv.experience,
            education: cv.education,
            skills: cv.skills,
            languages: cv.languages,
            certifications: cv.certifications,
            projects: cv.projects,
            settings: {
                primary_color: cv.settings.primaryColor,
                show_photo: cv.settings.showPhoto,
                page_size: cv.settings.pageSize,
                font_size: cv.settings.fontSize,
            },
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('cvs')
            .upsert(dbCV);

        if (error) {
            console.error('Error saving CV:', error);
            return { success: false, error: 'Kunde inte spara CV' };
        }

        return { success: true };
    } catch (error) {
        console.error('Save CV error:', error);
        return { success: false, error: 'Sparningsfel' };
    }
}

// ============================================
// CREDITS SYNC
// ============================================

/**
 * Debitera credits i databasen
 */
export async function deductCreditsInDatabase(
    userId: string,
    amount: number,
    reason: string
): Promise<SyncResult> {
    try {
        // Först, hämta nuvarande credits
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (fetchError || !profile) {
            return { success: false, error: 'Kunde inte hämta credits' };
        }

        if (profile.credits < amount) {
            return { success: false, error: 'Otillräckliga credits' };
        }

        // Uppdatera credits
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - amount })
            .eq('id', userId);

        if (updateError) {
            return { success: false, error: 'Kunde inte uppdatera credits' };
        }

        // Logga användningen
        await supabase.from('ai_generations').insert({
            user_id: userId,
            type: reason,
            credits_used: amount,
        });

        // Uppdatera Zustand store
        usePortfolyoStore.getState().useCredits(amount);

        return { success: true };
    } catch (error) {
        console.error('Deduct credits error:', error);
        return { success: false, error: 'Credits-fel' };
    }
}

// ============================================
// FULL SYNC
// ============================================

/**
 * Full synkronisering - anropas vid app-start
 */
export async function performFullSync(): Promise<SyncResult> {
    console.log('[Sync] Starting full sync...');

    // 1. Synka user
    const userResult = await syncUserFromSupabase();
    if (!userResult.success) {
        return userResult;
    }

    // 2. Om inloggad, synka portfolios och CVs
    const user = usePortfolyoStore.getState().user;
    if (user) {
        await Promise.all([
            syncPortfoliosFromSupabase(),
            syncCVsFromSupabase(),
        ]);
    }

    console.log('[Sync] Full sync complete');
    return { success: true };
}

// ============================================
// AUTH STATE LISTENER
// ============================================

let authSubscription: { unsubscribe: () => void } | null = null;

/**
 * Starta lyssning på auth-ändringar
 */
export function startAuthListener(): void {
    if (authSubscription) return;

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[Auth] State changed:', event);

        switch (event) {
            case 'SIGNED_IN':
                await syncUserFromSupabase();
                await Promise.all([
                    syncPortfoliosFromSupabase(),
                    syncCVsFromSupabase(),
                ]);
                break;

            case 'SIGNED_OUT':
                usePortfolyoStore.getState().logout();
                break;

            case 'TOKEN_REFRESHED':
                // Token refreshed, no action needed
                break;

            case 'USER_UPDATED':
                await syncUserFromSupabase();
                break;
        }
    });

    authSubscription = data.subscription;
}

/**
 * Stoppa lyssning på auth-ändringar
 */
export function stopAuthListener(): void {
    if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
    }
}
