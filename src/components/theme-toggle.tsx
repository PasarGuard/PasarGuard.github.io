'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme)
    },
    [setTheme],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="transition-colors duration-200">
          <Sun className="dark:hidden transition-all duration-300 ease-in-out" />
          <Moon className="hidden dark:block transition-all duration-300 ease-in-out" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="transition-all duration-200 ease-in-out">
        <DropdownMenuItem 
          onClick={() => toggleTheme('light')} 
          className={`transition-colors duration-150 hover:bg-accent ${theme === 'light' ? 'bg-accent' : ''}`}
        >
          <Sun className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleTheme('dark')} 
          className={`transition-colors duration-150 hover:bg-accent ${theme === 'dark' ? 'bg-accent' : ''}`}
        >
          <Moon className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleTheme('system')} 
          className={`transition-colors duration-150 hover:bg-accent ${theme === 'system' ? 'bg-accent' : ''}`}
        >
          <Monitor className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
