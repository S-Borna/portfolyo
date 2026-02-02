import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { renderPortfolio } from '@/lib/templates/renderer';
import { toRenderData } from '@/lib/models';
import type { DbPortfolio } from '@/lib/models';

// ============================================
// PUBLIC PORTFOLIO PAGE
// Server-rendered for SEO
// ============================================

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
    params: Promise<{ username: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('title, tagline, bio, seo_title, seo_description, og_image')
        .eq('username', username.toLowerCase())
        .eq('status', 'published')
        .single();

    if (!portfolio) {
        return {
            title: 'Portfolio hittades inte | PORTFOLYO.SE',
        };
    }

    const title = portfolio.seo_title || `${portfolio.title} | PORTFOLYO.SE`;
    const description = portfolio.seo_description || portfolio.tagline || portfolio.bio || '';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'profile',
            images: portfolio.og_image ? [portfolio.og_image] : [],
            url: `https://portfolyo.se/p/${username}`,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
    const { username } = await params;

    // Fetch portfolio
    const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('status', 'published')
        .single();

    if (error || !portfolio) {
        notFound();
    }

    // Track view
    const visitorHash = Math.random().toString(36).substring(7); // Simplified for SSR
    await supabase.rpc('track_portfolio_view', {
        p_portfolio_id: portfolio.id,
        p_visitor_hash: visitorHash,
    });

    // Convert to render data
    const renderData = toRenderData(portfolio as DbPortfolio);

    // Render HTML
    const html = renderPortfolio(renderData, portfolio.template_id);

    // Return raw HTML (bypassing Next.js layout)
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body dangerouslySetInnerHTML={{ __html: html }} />
        </html>
    );
}

// Revalidate every 5 minutes
export const revalidate = 300;
