import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only allow root path, API routes, and Next.js internal routes
  if (pathname === '/' || 
      pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Check if path has a valid locale prefix
  const validLocales = ['en', 'fa', 'ru', 'zh'];
  const pathSegments = pathname.split('/');
  const firstSegment = pathSegments[1];
  
  if (!validLocales.includes(firstSegment)) {
    // Redirect to English version with the same path
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url, 307); // Use 307 for temporary redirect
  }
  
  // Allow the request to continue for valid localized paths
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // You may need to adjust it to ignore static assets in `/public` folder
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 