import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
        <p className="text-fd-muted-foreground">
          You can open{' '}
          <Link
            href={locale === 'en' ? '/docs' : `/${locale}/docs`}
            className="text-fd-foreground font-semibold underline"
          >
            /docs
          </Link>{' '}
          and see the documentation.
        </p>
      </main>
    </HomeLayout>
  );
}
