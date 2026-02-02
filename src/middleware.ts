import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domäner som INTE ska behandlas som användar-subdomäner
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'dashboard'];
const MAIN_DOMAIN = 'portfolyo.se';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Utvecklingsmiljö - localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // I dev kan vi testa med ?subdomain=username
    const testSubdomain = url.searchParams.get('subdomain');
    if (testSubdomain) {
      url.pathname = `/p/${testSubdomain}${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
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
    return NextResponse.next();
  }

  // Om det är en användar-subdomän (t.ex. said.portfolyo.se)
  if (subdomain && subdomain !== MAIN_DOMAIN) {
    // Skriv om till /p/[username] internt
    url.pathname = `/p/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcha alla routes utom statiska filer och API
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
