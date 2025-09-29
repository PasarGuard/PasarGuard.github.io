'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages as LanguagesIcon } from 'lucide-react';

const supportedLangs = ['en', 'fa', 'zh', 'ru'];

// Helper function to get locale from pathname (can be used on both server and client)
function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  if (supportedLangs.includes(locale)) {
    return locale;
  }
  // If no locale in path, it's English
  return 'en';
}

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState(() => getLocaleFromPathname(pathname));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Extract current locale from pathname
    const locale = getLocaleFromPathname(pathname);
    setCurrentLocale(locale);
  }, [pathname]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <LanguagesIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top">
          <DropdownMenuItem>System</DropdownMenuItem>
          <DropdownMenuItem>English</DropdownMenuItem>
          <DropdownMenuItem>فارسی</DropdownMenuItem>
          <DropdownMenuItem>简体中文</DropdownMenuItem>
          <DropdownMenuItem>Русский</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const changeLanguage = async (lang: string) => {
    if (lang === 'system') {
      // detect browser language and change without reload
      const detectedLang = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
      const langToSet = supportedLangs.includes(detectedLang) ? detectedLang : 'en';
      
      // Store preference in localStorage
      localStorage.setItem('preferred-locale', langToSet);
      
      // Navigate to the new locale
      if (langToSet === 'en') {
        // For English, use root paths
        if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/')) {
          const newPath = pathname.replace(/^\/[a-z]{2}\//, '/');
          router.push(newPath);
        } else {
          router.push(pathname);
        }
      } else {
        // For other languages, add locale prefix
        if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/') || pathname.startsWith('/en/')) {
          const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${langToSet}/`);
          router.push(newPath);
        } else {
          router.push(`/${langToSet}${pathname}`);
        }
      }
      
      // Update document attributes
      document.documentElement.lang = langToSet;
      document.documentElement.setAttribute('dir', langToSet === 'fa' ? 'rtl' : 'ltr');
    } else {
      // Store preference in localStorage
      localStorage.setItem('preferred-locale', lang);
      
      // Navigate to the new locale
      if (lang === 'en') {
        // For English, use root paths
        if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/')) {
          const newPath = pathname.replace(/^\/[a-z]{2}\//, '/');
          router.push(newPath);
        } else {
          router.push(pathname);
        }
      } else {
        // For other languages, add locale prefix
        if (pathname.startsWith('/fa/') || pathname.startsWith('/ru/') || pathname.startsWith('/zh/') || pathname.startsWith('/en/')) {
          const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${lang}/`);
          router.push(newPath);
        } else {
          router.push(`/${lang}${pathname}`);
        }
      }
      
      // Update document attributes
      document.documentElement.lang = lang;
      document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top">
        <DropdownMenuItem onClick={() => changeLanguage('system')}>System</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fa')}>فارسی</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('zh')}>简体中文</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>Русский</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}