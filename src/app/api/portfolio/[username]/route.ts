import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderPortfolio } from '@/lib/templates/renderer';
import { toRenderData } from '@/lib/models';
import type { DbPortfolio } from '@/lib/models';

// ============================================
// PORTFOLIO HOSTING API
// Serves rendered portfolio HTML
// ============================================

// Create Supabase client lazily (not at build time)
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
    const { username: rawUsername } = await params;
    const username = rawUsername.toLowerCase();
    const supabase = getSupabase();

    try {
        // Fetch portfolio by username
        const { data: portfolio, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('username', username)
            .eq('status', 'published')
            .single();

        if (error || !portfolio) {
            return new NextResponse(render404(username), {
                status: 404,
                headers: { 'Content-Type': 'text/html' },
            });
        }

        // Track view (fire and forget)
        const visitorHash = hashVisitor(request);
        supabase.rpc('track_portfolio_view', {
            p_portfolio_id: portfolio.id,
            p_visitor_hash: visitorHash,
        });

        // Convert to render data
        const renderData = toRenderData(portfolio as DbPortfolio);

        // Render HTML
        const html = renderPortfolio(renderData, portfolio.template_id);

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, max-age=60, s-maxage=300', // Cache for 5 min at CDN
            },
        });

    } catch (error) {
        console.error('Error rendering portfolio:', error);
        return new NextResponse(renderError(), {
            status: 500,
            headers: { 'Content-Type': 'text/html' },
        });
    }
}

// ============================================
// HELPERS
// ============================================

function hashVisitor(request: NextRequest): string {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Simple hash for visitor identification
    const str = `${ip}-${userAgent}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function render404(username: string): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio hittades inte | PORTFOLYO.SE</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
    }
    .container { text-align: center; max-width: 400px; }
    .icon {
      width: 80px;
      height: 80px;
      background: #1a1a1a;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #666; margin-bottom: 2rem; }
    .username { color: #ff4d4d; font-family: monospace; }
    a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #ff4d4d;
      color: #fff;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    }
    a:hover { background: #ff3333; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔍</div>
    <h1>Portfolio hittades inte</h1>
    <p>
      Användaren <span class="username">@${username}</span> finns inte
      eller har inte publicerat sin portfolio än.
    </p>
    <a href="https://portfolyo.se">
      <span>✨</span>
      Skapa din egen portfolio
    </a>
  </div>
</body>
</html>`;
}

function renderError(): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Något gick fel | PORTFOLYO.SE</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
    }
    .container { text-align: center; max-width: 400px; }
    .icon {
      width: 80px;
      height: 80px;
      background: #1a1a1a;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #666; margin-bottom: 2rem; }
    a {
      display: inline-block;
      color: #ff4d4d;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚠️</div>
    <h1>Något gick fel</h1>
    <p>Vi kunde inte ladda denna portfolio. Försök igen om en stund.</p>
    <a href="https://portfolyo.se">Tillbaka till startsidan</a>
  </div>
</body>
</html>`;
}
