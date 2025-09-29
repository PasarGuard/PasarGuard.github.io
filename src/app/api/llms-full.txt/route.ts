import { getLLMText, source } from '@/lib/source';
import { getPreferredLanguage } from '@/lib/language-utils';
import { loadContentForLanguage } from '@/lib/content-loader';

export const revalidate = false;

export async function GET(request: Request) {
  const language = getPreferredLanguage(request);
  
  // Get all pages from source
  const pages = source.getPages();
  
  // Load language-specific content for each page
  const scan = pages.map(async (page) => {
    try {
      // Try to load language-specific content
      const languageContent = await loadContentForLanguage(page.slugs, language);
      
      if (languageContent.exists && languageContent.content) {
        // Use translated content
        return `# ${languageContent.title} (${page.url})\n\n${languageContent.content}`;
      } else {
        // Fall back to original content
        return getLLMText(page);
      }
    } catch (error) {
      // Fall back to original content
      return getLLMText(page);
    }
  });
  
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Language': language,
    },
  });
}
