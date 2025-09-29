import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
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

export default async function Layout({ 
  children, 
  params 
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  
  // Determine if the locale is RTL
  const isRTL = ['fa', 'ar'].includes(locale || '');
  
  return (
    <html 
      lang={locale || 'en'} 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${vazirMatn.variable}`}
      suppressHydrationWarning
    >
      <body className={`flex flex-col min-h-screen ${isRTL ? 'font-vazir' : 'font-inter'}`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
