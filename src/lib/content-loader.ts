import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const languageContentMap = {
  en: 'content/docs/en',
  fa: 'content/docs/fa',
  ru: 'content/docs/ru',
  zh: 'content/docs/zh',
};

export async function loadContentForLanguage(slug: string[], locale: string) {
  const contentPath = languageContentMap[locale as keyof typeof languageContentMap] || languageContentMap.en;
  const filePath = join(process.cwd(), contentPath, `${slug.join('/') || 'index'}.mdx`);
  
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      content: content,
      exists: true,
    };
  } catch (error) {
    // Debug logging for fa locale
    if (locale === 'fa') {
      console.log('FA Content Load Error:', error);
    }
    
    // Fall back to English if language-specific content doesn't exist
    if (locale !== 'en') {
      return loadContentForLanguage(slug, 'en');
    }
    
    return {
      title: 'Page Not Found',
      description: 'Content not found',
      content: '# Page Not Found\n\nThis content is not available in the selected language.',
      exists: false,
    };
  }
}

export function getLocaleFromQuery(searchParams: Record<string, string | string[] | undefined>): string {
  const queryLang = searchParams.lang;
  const lang = Array.isArray(queryLang) ? queryLang[0] : queryLang;
  return ['en', 'fa', 'ru', 'zh'].includes(lang || '') ? lang! : 'en';
}

export function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  return ['en', 'fa', 'ru', 'zh'].includes(locale || '') ? locale! : 'en';
}

// Generate TOC from translated content
export function generateTOCFromContent(content: string) {
  const lines = content.split('\n');
  const toc: Array<{ depth: number; url: string; title: string }> = [];
  const urlCounts: Record<string, number> = {}; // Track URL usage to ensure uniqueness
  
  let insideTabs = false;
  let tabDepth = 0; // Track nested tab levels
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Track if we're inside a Tabs component - handle various formats
    if (trimmedLine.includes('<Tabs') || 
        trimmedLine.includes('<Tab ') || 
        trimmedLine.includes('<Tab>') ||
        trimmedLine.includes('import { Tabs') ||
        trimmedLine.includes('import { Tab')) {
      insideTabs = true;
      tabDepth++;
    }
    
    // Track closing tabs
    if (trimmedLine.includes('</Tabs>') || 
        trimmedLine.includes('</Tab>')) {
      tabDepth--;
      if (tabDepth <= 0) {
        insideTabs = false;
        tabDepth = 0;
      }
    }
    
    // Skip headings inside tabs - they shouldn't be in TOC
    if (insideTabs) {
      return;
    }
    
    // Match headings (##, ###, etc.) only outside of tabs
    const headingMatch = trimmedLine.match(/^(#{2,6})\s+(.+)$/);
    if (headingMatch) {
      const depth = headingMatch[1].length;
      const title = headingMatch[2];
      
      // Skip if this looks like a tab title (common patterns)
      if (title.includes('Install') && title.includes('PasarGuard')) {
        return;
      }
      
      // Generate URL anchor from title with better handling for non-English text
      let baseUrl = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      // If the URL is empty or just hyphens, use a fallback
      if (!baseUrl || baseUrl === '-' || baseUrl === '--') {
        baseUrl = `heading-${index}`;
      }
      
      // Ensure URL uniqueness by adding a counter if needed
      let finalUrl = `#${baseUrl}`;
      if (urlCounts[finalUrl]) {
        urlCounts[finalUrl]++;
        finalUrl = `#${baseUrl}-${urlCounts[finalUrl]}`;
      } else {
        urlCounts[finalUrl] = 1;
      }
      
      toc.push({
        depth,
        url: finalUrl,
        title
      });
    }
  });
  
  return toc;
}