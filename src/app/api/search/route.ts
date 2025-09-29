import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { getPreferredLanguage } from '@/lib/language-utils';

// Language mapping for Orama search
const languageMap = {
  en: 'english',
  fa: 'persian',
  ru: 'russian',
  zh: 'chinese',
};

// Dynamic language detection based on Accept-Language header
export async function GET(request: Request) {
  const language = getPreferredLanguage(request);
  const oramaLanguage = languageMap[language as keyof typeof languageMap] || 'english';
  
  // Create a new source with the detected language
  const languageSource = createFromSource(source, {
    language: oramaLanguage,
  });
  
  return languageSource.GET(request);
}
