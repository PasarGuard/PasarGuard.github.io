import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { NextRequest } from 'next/server';

// Map of supported languages for Orama tokenizer
const supportedLanguages = {
  'en': 'english',
  'ru': 'russian', 
  'zh': 'chinese',
  'fa': 'english', // Fallback to English for Persian as it's not supported
};

// Create search handlers for each supported language
const searchHandlers = {
  english: createFromSource(source, { language: 'english' }),
  russian: createFromSource(source, { language: 'russian' }),
  chinese: createFromSource(source, { language: 'chinese' }),
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  // Get the appropriate language for the tokenizer
  const language = supportedLanguages[locale as keyof typeof supportedLanguages] || 'english';
  
  // Use the appropriate search handler
  const handler = searchHandlers[language as keyof typeof searchHandlers] || searchHandlers.english;
  
  return handler.GET(request);
}