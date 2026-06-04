'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { startNavigationLoading } from '@/components/NavigationLoadingBar';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface HeaderControlsProps {
  currentLang: string;
  isRTL?: boolean;
}

export function HeaderControls({ currentLang, isRTL = false }: HeaderControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = useCallback(
    (newLang: string) => {
      const segments = pathname.split('/');
      segments[1] = newLang;
      const newPath = segments.join('/');
      startNavigationLoading();
      router.push(newPath);
    },
    [router, pathname],
  );

  const toggleTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center gap-1 sm:gap-2",
        isRTL ? 'flex-row-reverse' : 'flex-row'
      )}>
        <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
        <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        isRTL ? 'flex-row-reverse' : 'flex-row'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Language Switcher - Compact on mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "h-8 px-2 sm:px-3 gap-1 sm:gap-2 transition-colors duration-200",
              "min-w-[32px] sm:min-w-[80px] justify-center sm:justify-start",
              "hover:bg-accent/50 border-border/50"
            )}
          >
            <span className="text-sm">{currentLanguage.flag}</span>
            <span className="hidden sm:inline text-xs font-medium truncate max-w-[50px]">
              {currentLanguage.name}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50 hidden sm:block" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "end" : "start"} 
          side="bottom" 
          className="w-48 min-w-[180px]"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={cn(
                "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
                "flex items-center gap-2",
                currentLang === language.code && "bg-accent text-accent-foreground"
              )}
            >
              <span className="text-sm">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
              {currentLang === language.code && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle - Icon only on mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "h-8 w-8 sm:w-auto sm:px-3 gap-1 sm:gap-2 transition-colors duration-200",
              "justify-center hover:bg-accent/50 border-border/50"
            )}
          >
            <Sun className="h-4 w-4 dark:hidden transition-all duration-300" />
            <Moon className="h-4 w-4 hidden dark:block transition-all duration-300" />
            <span className="hidden sm:inline text-xs font-medium">
              {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50 hidden sm:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "end" : "start"} 
          side="bottom" 
          className="w-40"
        >
          <DropdownMenuItem 
            onClick={() => toggleTheme('light')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-2",
              theme === 'light' && "bg-accent text-accent-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
            <span className="font-medium">Light</span>
            {theme === 'light' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('dark')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-2",
              theme === 'dark' && "bg-accent text-accent-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
            <span className="font-medium">Dark</span>
            {theme === 'dark' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('system')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-2",
              theme === 'system' && "bg-accent text-accent-foreground"
            )}
          >
            <Monitor className="h-4 w-4" />
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
