export function getLanguageFromHeaders(request: Request): string {
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

export function getLanguageFromURL(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  return ['en', 'fa', 'ru', 'zh'].includes(locale || '') ? locale! : 'en';
}

export function getPreferredLanguage(request: Request, pathname?: string): string {
  // First try to get from URL path
  if (pathname) {
    const urlLang = getLanguageFromURL(pathname);
    if (urlLang !== 'en') {
      return urlLang;
    }
  }
  
  // Then try Accept-Language header
  return getLanguageFromHeaders(request);
}

