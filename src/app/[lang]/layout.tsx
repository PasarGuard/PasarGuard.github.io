import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { Inter } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const vazirMatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
});

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    fa: {
      displayName: 'فارسی',
      search: 'جستجو در مستندات',
    },
    ru: {
      displayName: 'Русский',
      search: 'Поиск в документации',
    },
    zh: {
      displayName: '中文',
      search: '搜索文档',
    },
  },
});

export default async function Layout({ 
  children, 
  params 
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // Determine if the locale is RTL
  const isRTL = ['fa', 'ar'].includes(lang);
  
  return (
    <html 
      lang={lang} 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${vazirMatn.variable}`}
      suppressHydrationWarning
    >
      <body className={`flex flex-col min-h-screen ${isRTL ? 'font-vazir' : 'font-inter'}`}>
        <RootProvider i18n={provider(lang)}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
