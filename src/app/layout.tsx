import './global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://pasarguard.github.io'),
  title: {
    default: 'PasarGuard - Unified GUI Censorship Resistant Solution',
    template: '%s | PasarGuard Documentation'
  },
  description: 'PasarGuard is a proxy management tool that provides a simple and easy-to-use user interface for managing hundreds of proxy accounts powered by Xray-core.',
  keywords: ['proxy', 'vpn', 'censorship', 'xray', 'v2ray', 'shadowsocks', 'trojan', 'vless', 'vmess'],
  authors: [{ name: 'PasarGuard Team' }],
  creator: 'PasarGuard',
  publisher: 'PasarGuard',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/static/favicon.ico',
    shortcut: '/static/favicon.ico',
    apple: '/static/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pasarguard.github.io',
    siteName: 'PasarGuard',
    title: 'PasarGuard - Unified GUI Censorship Resistant Solution',
    description: 'PasarGuard is a proxy management tool that provides a simple and easy-to-use user interface for managing hundreds of proxy accounts powered by Xray-core.',
    images: [
      {
        url: '/static/logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'PasarGuard - Unified GUI Censorship Resistant Solution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PasarGuard - Unified GUI Censorship Resistant Solution',
    description: 'PasarGuard is a proxy management tool that provides a simple and easy-to-use user interface for managing hundreds of proxy accounts powered by Xray-core.',
    images: ['/static/logo-dark.png'],
    creator: '@pasarguard',
  },
  alternates: {
    canonical: 'https://pasarguard.github.io',
    languages: {
      'en': '/en',
      'fa': '/fa',
      'ru': '/ru',
      'zh': '/zh',
    },
  },
};

export default function RootLayout({ 
  children 
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
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
      <body>
        {children}
      </body>
    </html>
  );
}
