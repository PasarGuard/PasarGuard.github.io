'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Languages as LanguagesIcon, Monitor, Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function CompactControls() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('en');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Extract current locale from pathname
    const segments = pathname.split('/');
    const locale = segments[1];
    if (['en', 'fa', 'ru', 'zh'].includes(locale)) {
      setCurrentLocale(locale);
    } else {
      setCurrentLocale('en');
    }
  }, [pathname]);

  const handleLanguageChange = (locale: string) => {
    localStorage.setItem('preferred-locale', locale);
    
    if (locale === 'en') {
      if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/')) {
        const newPath = pathname.replace(/^\/[a-z]{2}\//, '/');
        router.push(newPath);
      } else {
        router.push(pathname);
      }
    } else {
      if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/') || pathname.startsWith('/en/')) {
        const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${locale}/`);
        router.push(newPath);
      } else {
        router.push(`/${locale}${pathname}`);
      }
    }
    
    document.documentElement.lang = locale;
    document.documentElement.setAttribute('dir', locale === 'fa' ? 'rtl' : 'ltr');
  };

  const toggleTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="flex items-center gap-1">
      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LanguagesIcon className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer ${currentLocale === lang.code ? 'bg-accent' : ''}`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem 
            onClick={() => toggleTheme('light')} 
            className={`cursor-pointer ${theme === 'light' ? 'bg-accent' : ''}`}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('dark')} 
            className={`cursor-pointer ${theme === 'dark' ? 'bg-accent' : ''}`}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('system')} 
            className={`cursor-pointer ${theme === 'system' ? 'bg-accent' : ''}`}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
