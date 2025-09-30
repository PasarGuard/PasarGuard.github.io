import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { generateTOCFromContent } from '@/lib/content-loader';
import { getOGImagePath } from '@/lib/og-image-utils';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const lang = params.lang;

  const page = source.getPage(params.slug, lang);
  if (!page) notFound();

  // Use the page data directly from the source system
  const pageTitle = page.data.title;
  const pageDescription = page.data.description;
  
  // Generate custom TOC that excludes headings inside tabs
  const processedContent = await page.data.getText('processed');
  const customToc = generateTOCFromContent(processedContent);
  
  const MDX = page.data.body;

  return (
    <DocsPage 
      toc={customToc} 
      full={page.data.full}
    >
      <div className="space-y-4 sm:space-y-6">
        <DocsTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          {pageTitle}
        </DocsTitle>
        {pageDescription && (
          <DocsDescription className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {pageDescription}
          </DocsDescription>
        )}
      </div>
      <DocsBody className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  const page = source.getPage(params.slug, lang);
  if (!page) notFound();

  // Use the page data directly from the source system
  const pageTitle = page.data.title;
  const pageDescription = page.data.description;
  
  // Generate the canonical URL for this page
  const slug = params.slug ? `/${params.slug.join('/')}` : '';
  const canonicalUrl = `/${lang}/docs${slug}`;

  return {
    metadataBase: new URL('https://pasarguard.github.io'),
    title: pageTitle,
    description: pageDescription,
    icons: {
      icon: '/static/favicon.ico',
      shortcut: '/static/favicon.ico',
      apple: '/static/favicon.ico',
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'article',
      locale: lang,
      url: canonicalUrl,
      siteName: 'PasarGuard Documentation',
      images: [
        {
          url: getOGImagePath(lang, params.slug),
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [getOGImagePath(lang, params.slug)],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `/en/docs${slug}`,
        'fa': `/fa/docs${slug}`,
        'ru': `/ru/docs${slug}`,
        'zh': `/zh/docs${slug}`,
      },
    },
  };
}
