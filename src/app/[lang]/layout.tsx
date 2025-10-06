import { RootProvider } from 'fumadocs-ui/provider';
import { NextProvider } from 'fumadocs-core/framework/next';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
import { i18n } from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const vazirMatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
});

export default async function LangLayout({ 
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
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                  document.documentElement.style.backgroundColor = theme === 'dark' ? 'hsl(240 2% 11%)' : 'hsl(240 5% 96%)';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`flex flex-col min-h-screen ${inter.variable} ${vazirMatn.variable} ${isRTL ? 'font-vazir' : 'font-inter'}`}>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <NextProvider>
              <RootProvider i18n={{ ...i18n, locale: lang }}>
                {children}
              </RootProvider>
            </NextProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
