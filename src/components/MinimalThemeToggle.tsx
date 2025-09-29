'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';
import { useTheme } from 'next-themes';

interface MinimalThemeToggleProps {
  isRTL?: boolean;
}

export function MinimalThemeToggle({ isRTL = false }: MinimalThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="transition-colors duration-200 min-w-[40px] justify-center"
        >
          <Sun className="dark:hidden h-4 w-4 transition-all duration-300 ease-in-out" />
          <Moon className="hidden dark:block h-4 w-4 transition-all duration-300 ease-in-out" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "end" : "start"} 
        side="bottom" 
        className="transition-all duration-200 ease-in-out min-w-[100px]"
      >
        <DropdownMenuItem 
          onClick={() => toggleTheme('light')} 
          className={`transition-colors duration-150 hover:bg-accent flex items-center gap-2 ${
            theme === 'light' ? 'bg-accent' : ''
          }`}
        >
          <Sun className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleTheme('dark')} 
          className={`transition-colors duration-150 hover:bg-accent flex items-center gap-2 ${
            theme === 'dark' ? 'bg-accent' : ''
          }`}
        >
          <Moon className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleTheme('system')} 
          className={`transition-colors duration-150 hover:bg-accent flex items-center gap-2 ${
            theme === 'system' ? 'bg-accent' : ''
          }`}
        >
          <Monitor className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}