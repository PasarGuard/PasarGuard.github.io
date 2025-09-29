'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface LanguageSwitcherProps {
  currentLang: string;
  isRTL?: boolean;
}

export function LanguageSwitcher({ currentLang, isRTL = false }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = useCallback(
    (newLang: string) => {
      // Replace the language segment in the pathname
      const segments = pathname.split('/');
      segments[1] = newLang;
      const newPath = segments.join('/');
      router.push(newPath);
    },
    [router, pathname],
  );

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="transition-colors duration-200 min-w-[60px] sm:min-w-[80px] justify-start gap-1 sm:gap-2"
        >
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-xs font-medium truncate hidden sm:inline">{currentLanguage.name}</span>
          <Globe className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "end" : "start"} 
        side="bottom" 
        className="transition-all duration-200 ease-in-out min-w-[120px]"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={`transition-colors duration-150 hover:bg-accent flex items-center gap-2 ${
              currentLang === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-sm">{language.flag}</span>
            <span className="text-sm font-medium">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
