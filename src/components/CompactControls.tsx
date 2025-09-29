'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Languages as LanguagesIcon, Monitor, Moon, Sun, ChevronDown } from 'lucide-react'
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
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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
    
    // Update current locale state immediately
    setCurrentLocale(locale);
    
    // Extract the path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    // Ensure we have a proper path (not just '/')
    const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    
    // Build the new path with the selected locale (treat all locales equally)
    const newPath = `/${locale}${cleanPath}`;
    
    router.push(newPath);
    
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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 w-full justify-center sm:justify-end">
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full justify-center sm:justify-end">
      {/* Language Switcher - Enhanced with current language display */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 gap-2 min-w-[80px] sm:min-w-[100px] hover:bg-accent transition-colors duration-200"
          >
            <span className="text-sm">{currentLanguage.flag}</span>
            <span className="hidden sm:inline text-xs font-medium truncate max-w-[60px]">
              {currentLanguage.name}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 min-w-[200px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer transition-colors duration-150 ${
                currentLocale === lang.code 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-accent/50'
              }`}
            >
              <span className="mr-3 text-base">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {currentLocale === lang.code && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle - Enhanced with current theme display */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 gap-2 min-w-[80px] sm:min-w-[100px] hover:bg-accent transition-colors duration-200"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
            <span className="hidden sm:inline text-xs font-medium">
              {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem 
            onClick={() => toggleTheme('light')} 
            className={`cursor-pointer transition-colors duration-150 ${
              theme === 'light' 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50'
            }`}
          >
            <Sun className="mr-3 h-4 w-4" />
            <span className="font-medium">Light</span>
            {theme === 'light' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('dark')} 
            className={`cursor-pointer transition-colors duration-150 ${
              theme === 'dark' 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50'
            }`}
          >
            <Moon className="mr-3 h-4 w-4" />
            <span className="font-medium">Dark</span>
            {theme === 'dark' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('system')} 
            className={`cursor-pointer transition-colors duration-150 ${
              theme === 'system' 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50'
            }`}
          >
            <Monitor className="mr-3 h-4 w-4" />
            <span className="font-medium">System</span>
            {theme === 'system' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
