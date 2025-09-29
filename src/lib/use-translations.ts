'use client';

import { useParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { type Locale, type Translations } from './server-i18n';

// Cache for client-side translations
const clientTranslationsCache = new Map<Locale, Translations>();

/**
 * Custom hook for client-side translations in the app directory
 */
export function useTranslations(): { t: (key: string) => string; locale: string } {
  const params = useParams();
  const locale = (params?.lang as Locale) || 'en';
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      // Return cached translations if available
      if (clientTranslationsCache.has(locale)) {
        setTranslations(clientTranslationsCache.get(locale)!);
        return;
      }

      try {
        // Load translations dynamically
        const translationsModule = await import(`../../public/locales/${locale}.json`);
        const translationsData = translationsModule.default;
        
        clientTranslationsCache.set(locale, translationsData);
        setTranslations(translationsData);
      } catch (error) {
        console.error(`Failed to load translations for locale: ${locale}`, error);
        
        // Fallback to English if the requested locale fails
        if (locale !== 'en') {
          try {
            const fallbackModule = await import(`../../public/locales/en.json`);
            const fallbackData = fallbackModule.default;
            clientTranslationsCache.set(locale, fallbackData);
            setTranslations(fallbackData);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations', fallbackError);
            // Use hardcoded fallback
            const fallbackTranslations: Translations = {
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
              }
            };
            setTranslations(fallbackTranslations);
          }
        } else {
          // Use hardcoded fallback for English
          const fallbackTranslations: Translations = {
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
            }
          };
          setTranslations(fallbackTranslations);
        }
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    
    return (typeof value === 'string' ? value : key);
  };

  return { t, locale };
}
