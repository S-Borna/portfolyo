import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domäner som INTE ska behandlas som användar-subdomäner
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'dashboard'];
const MAIN_DOMAIN = 'portfolyo.se';

// ============================================
// ENTERPRISE SECURITY HEADERS
// ============================================

const securityHeaders = {
  // Prevent clickjacking - strict
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information - strict
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy - disable everything unused
  'Permissions-Policy': [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=()',
    'geolocation=()',
    'gyroscope=()',
    'keyboard-map=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'navigation-override=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()',
  ].join(', '),

  // Content Security Policy - strict
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://www.google-analytics.com https://region1.google-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
  ].join('; '),

  // HSTS - Force HTTPS (1 year, include subdomains, preload ready)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Cross-Origin policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Resource-Policy': 'same-origin',

  // Cache control for HTML (no caching sensitive pages)
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
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
