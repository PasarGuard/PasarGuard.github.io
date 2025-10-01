'use client';

import Link from 'next/link';
import { ThemeLogo } from '@/components/ThemeLogo';
import { CompactControls } from '@/components/CompactControls';
import { CustomSearch } from '@/components/CustomSearch';
import { cn } from '@/lib/utils';
import { Translations } from '@/lib/translations';

interface CustomHeaderProps {
  lang: string;
  isRTL?: boolean;
  translations: Translations;
}

export function CustomHeader({ lang, isRTL = false, translations }: CustomHeaderProps) {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 group">
          <Link 
            href={`/${lang}`}
            className="flex items-center gap-2 transition-transform duration-200 group-hover:scale-105"
          >
            <ThemeLogo
              width={24}
              height={24}
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-semibold text-lg tracking-tight transition-colors duration-200 group-hover:text-primary">
              {translations.appName}
            </span>
          </Link>
        </div>

        {/* Header Controls */}
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? 'flex-row-reverse' : 'flex-row'
        )}>
          {/* Search */}
          <div className="hidden sm:block">
            <CustomSearch locale={lang} />
          </div>
          
          {/* Mobile Search */}
          <div className="block sm:hidden">
            <CustomSearch isMobile locale={lang} />
          </div>
          
          {/* Controls */}
          <CompactControls />
        </div>
      </div>
    </header>
  );
}
