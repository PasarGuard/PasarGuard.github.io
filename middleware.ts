import { NextRequest, NextResponse } from 'next/server';

function getLanguageFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) {
    return 'en';
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, qValue] = lang.trim().split(';q=');
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { locale: locale.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Check for supported languages
  const supportedLanguages = ['en', 'fa', 'ru', 'zh'];
  
  for (const { locale } of languages) {
    // Check exact match
    if (supportedLanguages.includes(locale)) {
      return locale;
    }
    
    // Check language code only (e.g., 'fa' from 'fa-IR')
    const langCode = locale.split('-')[0];
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }

  return 'en'; // Default fallback
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = ['en', 'fa', 'ru', 'zh'].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Get preferred language from Accept-Language header or cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const headerLocale = getLanguageFromHeaders(request);
  const locale = cookieLocale || headerLocale;
  
  // For English, don't redirect - let it use the original path
  if (locale === 'en') {
    return NextResponse.next();
  }
  
  // For other languages, redirect to include locale prefix
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|images|favicon.ico).*)',
  ],
}; 