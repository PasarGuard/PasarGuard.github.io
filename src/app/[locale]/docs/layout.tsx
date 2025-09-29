import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { createTranslatedPageTree } from '@/lib/source-i18n';
import { headers } from 'next/headers';
import { getPreferredLanguage } from '@/lib/language-utils';

export default async function Layout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Use locale from URL, but fallback to Accept-Language header
  const headersList = await headers();
  const request = new Request('http://localhost', { headers: headersList });
  const headerLocale = getPreferredLanguage(request);
  const finalLocale = locale || headerLocale;
  
  const translatedTree = await createTranslatedPageTree(finalLocale);
  return (
    <DocsLayout tree={translatedTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
