'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Languages as LanguagesIcon, Monitor, Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { Theme, useTheme } from '@/components/theme-provider'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/use-translations'
import { cn } from '@/lib/utils'

// Theme Toggle Component
export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { t } = useTranslations()

  const toggleTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme)
    },
    [setTheme],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-colors duration-200 hover:bg-accent/50">
          <Sun className="h-3.5 w-3.5 dark:hidden transition-all duration-300 ease-in-out" />
          <Moon className="h-3.5 w-3.5 hidden dark:block transition-all duration-300 ease-in-out" />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-32 transition-all duration-200 ease-in-out">
        <DropdownMenuItem onClick={() => toggleTheme('light')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <Sun className="mr-2 h-3.5 w-3.5 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">{t('theme.light')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('dark')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <Moon className="mr-2 h-3.5 w-3.5 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">{t('theme.dark')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('system')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <Monitor className="mr-2 h-3.5 w-3.5 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">{t('theme.system')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Language Component
export function Language() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState('en')
  const [mounted, setMounted] = useState(false)
  const supportedLangs = ['en', 'fa', 'zh', 'ru']

  useEffect(() => {
    setMounted(true)
    // Extract current locale from pathname
    const segments = pathname.split('/')
    const locale = segments[1]
    if (supportedLangs.includes(locale)) {
      setCurrentLocale(locale)
    } else {
      setCurrentLocale('en')
    }
  }, [pathname])

  const changeLanguage = async (lang: string) => {
    await handleLanguageChange(lang)
  }

  const handleLanguageChange = async (locale: string) => {
    localStorage.setItem('preferred-locale', locale)
    
    // Update current locale state immediately
    setCurrentLocale(locale)
    
    // Extract the path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    
    // Ensure we have a proper path (not just '/')
    const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale
    
    // Build the new path with the selected locale (treat all locales equally)
    const newPath = `/${locale}${cleanPath}`
    
    router.push(newPath)
    
    document.documentElement.lang = locale
    document.documentElement.setAttribute('dir', locale === 'fa' ? 'rtl' : 'ltr')
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <LanguagesIcon className="h-3.5 w-3.5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-colors duration-200 hover:bg-accent/50">
          <LanguagesIcon className={cn("h-3.5 w-3.5", currentLocale === 'fa' && 'rotate-180')} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-36">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <span className="text-sm">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fa')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <span className="text-sm">فارسی</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('zh')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <span className="text-sm">简体中文</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')} className="transition-colors duration-150 hover:bg-accent cursor-pointer">
          <span className="text-sm">Русский</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CompactControls() {
  return (
    <div className="flex items-center gap-1 w-full justify-center sm:justify-between">
      <Language />
      <ThemeToggle />
    </div>
  )
}
