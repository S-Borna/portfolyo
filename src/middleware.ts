import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domäner som INTE ska behandlas som användar-subdomäner
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'dashboard'];
const MAIN_DOMAIN = 'portfolyo.se';

// ============================================
// ENTERPRISE SECURITY HEADERS
// ============================================

const securityHeaders = {
  // Prevent clickjacking - allow same-origin iframes for previews
  'X-Frame-Options': 'SAMEORIGIN',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Referrer - send origin on cross-origin, full on same-origin
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy - only disable truly dangerous APIs
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
  ].join(', '),

  // Content Security Policy - relaxed but still protective
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://www.google-analytics.com https://region1.google-analytics.com https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),

  // HSTS - Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/upgrade', '/portfolio/', '/cv/'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // ============================================
  // SERVER-SIDE AUTH CHECK FOR PROTECTED ROUTES
  // ============================================
  const pathname = url.pathname;
  if (isProtectedRoute(pathname)) {
    const supabaseAuth = request.cookies.getAll().find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
    if (!supabaseAuth) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(response);
    }
  }

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
