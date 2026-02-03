import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domäner som INTE ska behandlas som användar-subdomäner
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'dashboard'];
const MAIN_DOMAIN = 'portfolyo.se';

// ============================================
// SECURITY HEADERS
// ============================================

const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (disable unused features)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Utvecklingsmiljö - localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // I dev kan vi testa med ?subdomain=username
    const testSubdomain = url.searchParams.get('subdomain');
    if (testSubdomain) {
      url.pathname = `/p/${testSubdomain}${url.pathname === '/' ? '' : url.pathname}`;
      const response = NextResponse.rewrite(url);
      return addSecurityHeaders(response);
    }
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Extrahera subdomän
  const hostParts = hostname.replace(`.${MAIN_DOMAIN}`, '').split('.');
  const subdomain = hostParts[0];

  // Om det är huvuddomänen eller reserverad subdomän - visa vanliga appen
  if (
    hostname === MAIN_DOMAIN ||
    hostname === `www.${MAIN_DOMAIN}` ||
    RESERVED_SUBDOMAINS.includes(subdomain)
  ) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Om det är en användar-subdomän (t.ex. said.portfolyo.se)
  if (subdomain && subdomain !== MAIN_DOMAIN) {
    // Skriv om till /p/[username] internt
    url.pathname = `/p/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    const response = NextResponse.rewrite(url);
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Matcha alla routes utom statiska filer och API
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
