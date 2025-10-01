'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LocalizedCardProps {
  title: string;
  href: string;
  children?: React.ReactNode;
}

export function LocalizedCard({ title, href, children }: LocalizedCardProps) {
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return ['en', 'fa', 'ru', 'zh'].includes(locale) ? locale : 'en';
  };
  
  // Create localized href
  const getLocalizedHref = (href: string) => {
    const currentLocale = getCurrentLocale();
    
    // If it's an external link, return as is
    if (href.startsWith('http') || href.startsWith('//')) {
      return href;
    }
    
    // If it's already a localized link, return as is
    if (href.startsWith(`/${currentLocale}/`)) {
      return href;
    }
    
    // If it starts with /, add locale prefix
    if (href.startsWith('/')) {
      return `/${currentLocale}${href}`;
    }
    
    // For relative links, add locale prefix
    return `/${currentLocale}/${href}`;
  };
  
  const currentLocale = getCurrentLocale();
  const localizedHref = getLocalizedHref(href);
  const isRTL = currentLocale === 'fa';
  
  return (
    <Link
      href={localizedHref}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline ${isRTL ? 'text-right' : ''}`}
    >
      <h3 className="font-semibold text-lg no-underline">{title}</h3>
      {children && <div className="no-underline">{children}</div>}
    </Link>
  );
}
