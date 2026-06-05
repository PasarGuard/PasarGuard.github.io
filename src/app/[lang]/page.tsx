import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loadTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChartColumn,
  Github,
  Network,
  RadioTower,
  Server,
  Settings2,
  ShieldCheck,
  Terminal,
  Users,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { CustomHeader } from '@/components/CustomHeader';
import { Metadata } from 'next';
import { getOGImagePath } from '@/lib/og-image-utils';

const validLanguages = ['en', 'fa', 'ru', 'zh'];

const landingCopy = {
  en: {
    eyebrow: 'PasarGuard documentation',
    heroTitle: 'PasarGuard. Proxy management, done right.',
    primaryCta: 'Start with docs',
    secondaryCta: 'View release',
    previewTitle: 'Service overview',
    previewStatus: 'V5 ready',
    nodeHealth: 'Node health',
    activeUsers: 'Active users',
    traffic: 'Traffic',
    ready: 'Ready',
    quickStart: 'Quick start',
    quickStartDescription: 'Install the panel, connect nodes, configure env values, and create owner access without guessing.',
    operations: 'Operations',
    operationsDescription: 'Use users, groups, templates, bulk actions, and statistics pages as the daily admin reference.',
    integration: 'Interfaces',
    integrationDescription: 'Find the interface documentation for clients and services without unrelated framework commands.',
    highlights: ['Panel setup', 'Node API', 'Hosts & Groups', 'Bulk operations'],
  },
  fa: {
    eyebrow: 'مستندات PasarGuard',
    heroTitle: 'PasarGuard. مدیریت پروکسی، درست و ساده.',
    primaryCta: 'شروع مستندات',
    secondaryCta: 'مشاهده نسخه',
    previewTitle: 'نمای کلی سرویس',
    previewStatus: 'آماده V5',
    nodeHealth: 'سلامت نودها',
    activeUsers: 'کاربران فعال',
    traffic: 'ترافیک',
    ready: 'آماده',
    quickStart: 'شروع سریع',
    quickStartDescription: 'نصب پنل، اتصال نودها، تنظیم env و ساخت دسترسی مالک را بدون حدس‌زدن دنبال کنید.',
    operations: 'عملیات',
    operationsDescription: 'صفحات کاربران، گروه‌ها، قالب‌ها، عملیات گروهی و آمار مرجع روزانه مدیریت هستند.',
    integration: 'رابط‌ها',
    integrationDescription: 'مستندات اتصال کلاینت‌ها و سرویس‌ها را بدون متن‌های نامرتبط فریم‌ورک ببینید.',
    highlights: ['نصب پنل', 'API نود', 'هاست‌ها و گروه‌ها', 'عملیات گروهی'],
  },
  ru: {
    eyebrow: 'Документация PasarGuard',
    heroTitle: 'PasarGuard. Управление прокси — просто и правильно.',
    primaryCta: 'Открыть docs',
    secondaryCta: 'Релиз',
    previewTitle: 'Обзор сервиса',
    previewStatus: 'V5 готова',
    nodeHealth: 'Состояние нод',
    activeUsers: 'Активные пользователи',
    traffic: 'Трафик',
    ready: 'Готово',
    quickStart: 'Быстрый старт',
    quickStartDescription: 'Установите панель, подключите ноды, настройте env и создайте доступ владельца без догадок.',
    operations: 'Операции',
    operationsDescription: 'Используйте страницы пользователей, групп, шаблонов, массовых действий и статистики.',
    integration: 'Интерфейсы',
    integrationDescription: 'Документация для клиентов и сервисов без нерелевантных команд фреймворка.',
    highlights: ['Панель', 'Node API', 'Хосты и группы', 'Bulk ops'],
  },
  zh: {
    eyebrow: 'PasarGuard 文档',
    heroTitle: 'PasarGuard. 代理管理，简单高效。',
    primaryCta: '开始阅读',
    secondaryCta: '查看版本',
    previewTitle: '服务概览',
    previewStatus: 'V5 就绪',
    nodeHealth: '节点健康',
    activeUsers: '活跃用户',
    traffic: '流量',
    ready: '就绪',
    quickStart: '快速开始',
    quickStartDescription: '按步骤安装面板、连接节点、配置 env，并创建 owner 访问权限。',
    operations: '运维操作',
    operationsDescription: '用户、分组、模板、批量操作和统计页面可作为日常管理参考。',
    integration: '接口',
    integrationDescription: '查看客户端和服务接口文档，不再出现无关框架命令。',
    highlights: ['面板安装', '节点 API', '主机与分组', '批量操作'],
  },
} as const;

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
  const copy = landingCopy[lang as keyof typeof landingCopy] ?? landingCopy.en;
  const features = [
    {
      href: `/${lang}/panel`,
      title: translations.panel.title,
      description: translations.panel.description,
      icon: ShieldCheck,
      className: 'block',
    },
    {
      href: `/${lang}/node`,
      title: translations.node.title,
      description: translations.node.description,
      icon: Server,
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
  const quickLinks = [
    { href: `/${lang}/panel/installation`, label: copy.highlights[0], icon: Settings2 },
    { href: `/${lang}/node/api`, label: copy.highlights[1], icon: RadioTower },
    { href: `/${lang}/panel/host`, label: copy.highlights[2], icon: Network },
    { href: `/${lang}/panel/bulk`, label: copy.highlights[3], icon: Users },
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomHeader lang={lang} isRTL={isRTL} translations={translations} />
      
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.22),transparent_32%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.55),hsl(var(--background)))]" />

        <section className="container mx-auto grid items-center gap-10 px-4 pt-12 pb-12 md:grid-cols-[1.05fr_0.95fr] md:pt-20">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="flex flex-wrap items-center gap-3 justify-start">
              <Badge
                variant="secondary"
                className="gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span>{translations.version}</span>
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">{copy.eyebrow}</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {translations.appDescription}
            </p>

            <div className={`mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 ${isRTL ? 'sm:justify-end' : ''}`}>
              <Button asChild size="lg" className="h-11 min-w-[180px] px-7 font-semibold">
                <Link href={`/${lang}/introduction`}>
                  <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {copy.primaryCta}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 min-w-[180px] px-7 font-semibold">
                <Link href="https://github.com/PasarGuard/panel/releases" target="_blank" rel="noopener noreferrer">
                  <Github className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {copy.secondaryCta}
                </Link>
              </Button>
            </div>

            <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex h-24 flex-col justify-between rounded-lg border border-border/70 bg-background/80 p-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent/60"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-card/90 p-4 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{copy.previewTitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">pasarguard.local</p>
              </div>
              <Badge variant="outline" className="gap-2 rounded-full border-primary/30 bg-primary/10 text-xs">
                <Activity className="h-3.5 w-3.5 text-primary" />
                {copy.previewStatus}
              </Badge>
            </div>

            <div className="grid gap-3 py-4 sm:grid-cols-3">
              {[
                { label: copy.nodeHealth, value: '99.9%', icon: Server },
                { label: copy.activeUsers, value: '12.4k', icon: Users },
                { label: copy.traffic, value: '8.7 TB', icon: ChartColumn },
              ].map((metric) => {
                const Icon = metric.icon;

                return (
                  <div key={metric.label} className="rounded-lg border border-border/60 bg-background/80 p-3">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <div dir='ltr' className="text-2xl font-bold">{metric.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-background/80 p-3">
              {[
                { id: 'panel-api', label: 'Panel API', status: copy.ready },
                { id: 'xray-core', label: 'Xray Core', status: copy.ready },
                { id: 'node-sync', label: 'Node sync', status: copy.ready },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="mx-auto mb-6 grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              { title: copy.quickStart, description: copy.quickStartDescription, icon: Settings2 },
              { title: copy.operations, description: copy.operationsDescription, icon: Users },
              { title: copy.integration, description: copy.integrationDescription, icon: Network },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-lg border border-border/70 bg-background/80 p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>

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
