import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { ThemeLogo } from '@/components/ThemeLogo';
import { HeaderControls } from '@/components/HeaderControls';
import { MobileHeaderControls } from '@/components/MobileHeaderControls';
import { i18n } from '@/lib/i18n';
import { loadTranslations } from '@/lib/translations';
import { CustomSearch } from '@/components/CustomSearch';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(locale: string, showControls: boolean = false): BaseLayoutProps {
  const translations = loadTranslations(locale);
  const isRTL = ['fa', 'ar'].includes(locale);

  return {
    i18n,
    nav: {
      title: (
        <div className="flex items-center gap-2 group">
          <ThemeLogo
            width={24}
            height={24}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-semibold text-lg tracking-tight transition-colors duration-200 group-hover:text-primary">
            {translations.appName}
          </span>
        </div>
      ),
      children: showControls ? (
        <div className="flex items-center justify-end px-2 sm:px-4">
          {/* Mobile: Single menu button */}
          <div className="block sm:hidden">
            <MobileHeaderControls currentLang={locale} isRTL={isRTL} />
          </div>
          {/* Desktop: Separate controls */}
          <div className="hidden sm:block">
            <HeaderControls currentLang={locale} isRTL={isRTL} />
          </div>
        </div>
      ) : undefined,
    },
    searchToggle: {
      enabled: true,
      components: {
        sm: <CustomSearch isMobile locale={locale} />,
        lg: <CustomSearch locale={locale} />
      }
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
