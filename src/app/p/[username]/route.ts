import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderPortfolioV2 } from '@/lib/templates/portfolio-renderer-v2';
import { toRenderDataV2 } from '@/lib/models';
import type { DbPortfolio } from '@/lib/models';

// ============================================
// PUBLIC PORTFOLIO PAGE - Serves raw HTML
// SEO metadata embedded in rendered HTML
// ============================================

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const supabase = getSupabase();

    // Fetch published portfolio
    const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('status', 'published')
        .single();

    if (error || !portfolio) {
        return new NextResponse(
            `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>404 - Portfolio hittades inte</title>
<style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff}
.c{text-align:center}h1{font-size:6rem;margin:0;opacity:.2}p{color:#888;margin-top:1rem}a{color:#8B5CF6;text-decoration:none}</style>
</head><body><div class="c"><h1>404</h1><p>Denna portfolio finns inte.</p><p><a href="https://portfolyo.se">Skapa din egen →</a></p></div></body></html>`,
            {
                status: 404,
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }
        );
    }

    // Track view (fire-and-forget)
    const visitorHash = Math.random().toString(36).substring(7);
    try {
        await supabase.rpc('track_portfolio_view', {
            p_portfolio_id: portfolio.id,
            p_visitor_hash: visitorHash,
        });
    } catch (_) { /* ignore tracking errors */ }

    // Convert DB data to V2 format
    const renderData = toRenderDataV2(portfolio as DbPortfolio);

    // Render full HTML document using V2 renderer (saidborna.com quality)
    const templateId = portfolio.template_id || 'dark-ember';
    const fullHtml = renderPortfolioV2(renderData, templateId);

    return new NextResponse(fullHtml, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}

// Dynamic rendering (runs on Cloudflare Workers at edge by default)
export const dynamic = 'force-dynamic';
