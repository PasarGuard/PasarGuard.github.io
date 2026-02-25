import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loadTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Box, Network, Terminal } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { CustomHeader } from '@/components/CustomHeader';
import { Metadata } from 'next';
import { getOGImagePath } from '@/lib/og-image-utils';

const validLanguages = ['en', 'fa', 'ru', 'zh'];

export async function generateStaticParams() {
  return validLanguages.map((lang) => ({
    lang: lang,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  // Validate if the lang parameter is a valid language
  if (!validLanguages.includes(lang)) {
    // Default to English if invalid language
    const translations = loadTranslations('en');
    return {
      metadataBase: new URL('https://pasarguard.github.io'),
      title: translations.appName,
      description: translations.appDescription,
      icons: {
        icon: '/static/favicon.ico',
        shortcut: '/static/favicon.ico',
        apple: '/static/favicon.ico',
      },
      openGraph: {
        title: translations.appName,
        description: translations.appDescription,
        type: 'website',
        url: '/en',
        siteName: 'PasarGuard',
        images: [
          {
            url: getOGImagePath('en'),
            width: 1200,
            height: 630,
            alt: translations.appName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: translations.appName,
        description: translations.appDescription,
        images: [getOGImagePath('en')],
      },
    };
  }
  
  const translations = loadTranslations(lang);
  
  return {
    metadataBase: new URL('https://pasarguard.github.io'),
    title: translations.appName,
    description: translations.appDescription,
    icons: {
      icon: '/static/favicon.ico',
      shortcut: '/static/favicon.ico',
      apple: '/static/favicon.ico',
    },
    openGraph: {
      title: translations.appName,
      description: translations.appDescription,
      type: 'website',
      locale: lang,
      url: `/${lang}`,
      siteName: 'PasarGuard',
      images: [
        {
          url: getOGImagePath(lang),
          width: 1200,
          height: 630,
          alt: translations.appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.appName,
      description: translations.appDescription,
      images: [getOGImagePath(lang)],
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'fa': '/fa',
        'ru': '/ru',
        'zh': '/zh',
      },
    },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Validate if the lang parameter is a valid language
  if (!validLanguages.includes(lang)) {
    redirect('/en');
  }
  
  const translations = loadTranslations(lang);
  const isRTL = ['fa', 'ar'].includes(lang);
  const features = [
    {
      href: `/${lang}/panel`,
      title: translations.panel.title,
      description: translations.panel.description,
      icon: Box,
      className: 'block',
    },
    {
      href: `/${lang}/node`,
      title: translations.node.title,
      description: translations.node.description,
      icon: Network,
      className: 'block',
    },
    {
      href: `/${lang}/interfaces`,
      title: translations.commands.title,
      description: translations.commands.description,
      icon: Terminal,
      className: 'block md:col-span-2 lg:col-span-1',
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <CustomHeader lang={lang} isRTL={isRTL} translations={translations} />
      
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />

        <section className="container mx-auto px-4 pt-14 pb-10 sm:pt-16 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <Link
              href="https://github.com/PasarGuard/panel/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span>{translations.version}</span>
                <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </Badge>
            </Link>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {translations.appName}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {translations.appDescription}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="h-11 min-w-[180px] px-7 font-semibold">
                <Link href={`/${lang}/introduction`}>
                  {translations.documentation}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 min-w-[180px] px-7 font-semibold">
                <Link href="https://github.com/PasarGuard" target="_blank" rel="noopener noreferrer">
                  <Github className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {translations.github}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link key={feature.href} href={feature.href} className={feature.className}>
                  <Card className="group h-full cursor-pointer border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="rounded-lg border bg-background/80 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <ArrowRight
                          className={`h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground ${isRTL ? 'rotate-180' : ''}`}
                        />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
