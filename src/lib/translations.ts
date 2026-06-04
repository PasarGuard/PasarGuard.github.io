import { readFileSync } from 'fs';
import { join } from 'path';

export interface Translations {
  appName: string;
  appDescription: string;
  version: string;
  documentation: string;
  github: string;
  panel: {
    title: string;
    description: string;
  };
  node: {
    title: string;
    description: string;
  };
  commands: {
    title: string;
    description: string;
  };
  search: {
    placeholder: string;
    button: string;
    title: string;
    noResults: string;
    noResultsDescription: string;
    searching: string;
    instructions: string;
    shortcuts: {
      search: string;
      navigate: string;
      select: string;
    };
  };
}

export function loadTranslations(locale: string): Translations {
  try {
    const filePath = join(process.cwd(), 'public', 'locales', `${locale}.json`);
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English
    return {
      appName: 'PasarGuard',
      appDescription: 'A production-focused panel and node system for proxy services, WireGuard, user operations, templates, and service monitoring.',
      version: 'V5 Released',
      documentation: 'Documentation',
      github: 'GitHub',
      panel: {
        title: 'Panel',
        description: 'Explore the best VPN panel with maximum customization capabilities'
      },
      node: {
        title: 'Node',
        description: 'Discover PasarGuard Node and other features'
      },
      commands: {
        title: 'Interfaces',
        description: 'Interface guides for connecting apps and clients to PasarGuard services'
      },
      search: {
        placeholder: 'Search documentation...',
        button: 'Search',
        title: 'Search Documentation',
        noResults: 'No results found',
        noResultsDescription: 'Try a different search term',
        searching: 'Searching...',
        instructions: 'Type to search across all pages',
        shortcuts: {
          search: 'to search',
          navigate: 'to navigate',
          select: 'to select'
        }
      }
    };
  }
}
