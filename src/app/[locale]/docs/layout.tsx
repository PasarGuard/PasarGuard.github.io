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
  
  // Use locale from URL parameter, which should be consistent between server and client
  const finalLocale = locale || 'en';
  
  const translatedTree = await createTranslatedPageTree(finalLocale);
  return (
    <DocsLayout tree={translatedTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
