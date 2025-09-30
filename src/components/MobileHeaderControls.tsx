'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface MobileHeaderControlsProps {
  currentLang: string;
  isRTL?: boolean;
}

export function MobileHeaderControls({ currentLang, isRTL = false }: MobileHeaderControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = useCallback(
    (newLang: string) => {
      const segments = pathname.split('/');
      segments[1] = newLang;
      const newPath = segments.join('/');
      router.push(newPath);
      setIsOpen(false);
    },
    [router, pathname],
  );

  const toggleTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
      setIsOpen(false);
    },
    [setTheme],
  );

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Menu Button */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 hover:bg-accent/50 border-border/50"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "end" : "start"} 
          side="bottom" 
          className="w-56 min-w-[200px] p-2"
        >
          {/* Language Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Language
          </div>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={cn(
                "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
                "flex items-center gap-3 px-2 py-2 rounded-md",
                currentLang === language.code && "bg-accent text-accent-foreground"
              )}
            >
              <span className="text-base">{language.flag}</span>
              <span className="text-sm font-medium flex-1">{language.name}</span>
              {currentLang === language.code && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Theme Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Theme
          </div>
          <DropdownMenuItem 
            onClick={() => toggleTheme('light')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-3 px-2 py-2 rounded-md",
              theme === 'light' && "bg-accent text-accent-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium flex-1">Light</span>
            {theme === 'light' && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('dark')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-3 px-2 py-2 rounded-md",
              theme === 'dark' && "bg-accent text-accent-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
            <span className="text-sm font-medium flex-1">Dark</span>
            {theme === 'dark' && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toggleTheme('system')} 
            className={cn(
              "cursor-pointer transition-colors duration-150 hover:bg-accent/50",
              "flex items-center gap-3 px-2 py-2 rounded-md",
              theme === 'system' && "bg-accent text-accent-foreground"
            )}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium flex-1">System</span>
            {theme === 'system' && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
