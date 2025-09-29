import { source } from '@/lib/source';
import { loadContentForLanguage } from '@/lib/content-loader';

// Create a custom page tree with translated titles and locale-aware URLs
export async function createTranslatedPageTree(locale: string = 'en') {
  const baseTree = source.pageTree;
  
  // Recursively translate titles and URLs in the tree
  const translateTree = async (node: any): Promise<any> => {
    if (node.type === 'page') {
      try {
        // Extract slug from the $ref.file or url
        const slug = node.$ref?.file ? [node.$ref.file.replace('.mdx', '')] : 
                    node.url ? node.url.replace('/docs/', '').split('/').filter(Boolean) : [];
        
        const translatedContent = await loadContentForLanguage(slug, locale);
        
        // Update URL to include locale prefix
        // For English, keep original URL (no locale prefix)
        // For other locales, add locale prefix
        const updatedUrl = locale === 'en' ? node.url : `/${locale}${node.url}`;
        
        
        return {
          ...node,
          name: translatedContent.title || node.name,
          description: translatedContent.description || node.description,
          url: updatedUrl,
          // Add RTL classes for Farsi
          className: locale === 'fa' ? 'rtl-text' : undefined,
        };
      } catch (error) {
        // Fallback to original node if translation fails, but still update URL
        const updatedUrl = locale === 'en' ? node.url : `/${locale}${node.url}`;
        return {
          ...node,
          url: updatedUrl,
        };
      }
    } else if (node.children) {
      const translatedChildren = await Promise.all(
        node.children.map((child: any) => translateTree(child))
      );
      return {
        ...node,
        children: translatedChildren,
      };
    }
    return node;
  };

  const translatedTree = await translateTree(baseTree);
  
  return translatedTree;
}

// Create a custom source with locale-aware base URL
export function createLocaleAwareSource(locale: string = 'en') {
  const baseUrl = locale === 'en' ? '/docs' : `/${locale}/docs`;
  
  return {
    ...source,
    baseUrl,
  };
}

// Create a custom source with translated content
export async function createTranslatedSource(locale: string = 'en') {
  const baseSource = source;
  
  // Get all pages and their translated content
  const pages = baseSource.getPages();
  const translatedPages = await Promise.all(
    pages.map(async (page) => {
      try {
        const translatedContent = await loadContentForLanguage(page.slugs, locale);
        return {
          ...page,
          data: {
            ...page.data,
            title: translatedContent.title || page.data.title,
            description: translatedContent.description || page.data.description,
            // Note: We can't easily replace the MDX body here as it's compiled
            // We'll handle content translation in the page component
          }
        };
      } catch (error) {
        return page;
      }
    })
  );
  
  // Return a custom source with translated pages
  return {
    ...baseSource,
    getPages: () => translatedPages,
    getPage: (slug: string[]) => {
      const page = baseSource.getPage(slug);
      if (!page) return null;
      
      // Find the translated version
      const translatedPage = translatedPages.find(p => 
        JSON.stringify(p.slugs) === JSON.stringify(slug)
      );
      
      return translatedPage || page;
    },
    pageTree: baseSource.pageTree, // We'll handle tree translation separately
  };
}

