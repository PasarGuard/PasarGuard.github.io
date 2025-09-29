'use client';

import { LanguageSwitcher } from './LanguageSwitcher';
import { MinimalThemeToggle } from './MinimalThemeToggle';

interface HeaderControlsProps {
  currentLang: string;
  isRTL?: boolean;
}

export function HeaderControls({ currentLang, isRTL = false }: HeaderControlsProps) {
  return (
    <div 
      className={`flex items-center gap-1 sm:gap-2 ${
        isRTL ? 'flex-row-reverse' : 'flex-row'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <LanguageSwitcher currentLang={currentLang} isRTL={isRTL} />
      <MinimalThemeToggle isRTL={isRTL} />
    </div>
  );
}
