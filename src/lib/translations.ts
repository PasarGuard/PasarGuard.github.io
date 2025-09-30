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
      appDescription: 'Censorship-resistant GUI integrated solution',
      version: 'V1 First Version',
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
        title: 'Commands',
        description: 'List of commands for launching, analyzing, building, and previewing your application'
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
