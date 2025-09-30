/**
 * Utility functions for Open Graph images
 */

export function getOGImagePath(lang: string, slug?: string[]): string {
  const baseUrl = 'https://pasarguard.github.io';
  
  if (!slug || slug.length === 0) {
    // Home page
    return `${baseUrl}/og-images/home.png`;
  }
  
  if (slug.length === 1 && slug[0] === 'docs') {
    // Docs index page
    return `${baseUrl}/og-images/docs.png`;
  }
  
  // Specific docs page
  const pageSlug = slug.join('-');
  return `${baseUrl}/og-images/${pageSlug}.png`;
}

export function getOGImagePathForPage(lang: string, pageTitle: string, pageDescription?: string): string {
  const baseUrl = 'https://pasarguard.github.io';
  
  // For dynamic pages, we'll use a fallback to the logo
  // In a real implementation, you might want to generate images on-demand
  return `${baseUrl}/static/logo-dark.png`;
}
