import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  // Get the Accept-Language header to detect user's preferred language
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Parse the Accept-Language header to get the preferred language
  const preferredLang = parseAcceptLanguage(acceptLanguage);
  
  // Redirect to the preferred language or default to English
  redirect(`/${preferredLang}`);
}

function parseAcceptLanguage(acceptLanguage: string): string {
  // Supported languages in order of preference
  const supportedLanguages = ['en', 'fa', 'ru', 'zh'];
  
  if (!acceptLanguage) return 'en';
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,fa;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, qValue] = lang.trim().split(';q=');
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { locale: locale.split('-')[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Find the first supported language
  for (const { locale } of languages) {
    if (supportedLanguages.includes(locale)) {
      return locale;
    }
  }
  
  return 'en'; // Default fallback
}
