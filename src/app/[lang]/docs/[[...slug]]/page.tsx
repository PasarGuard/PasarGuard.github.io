import { getPageImage, source } from '@/lib/source';
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
import { loadContentForLanguage, generateTOCFromContent } from '@/lib/content-loader';
import { TranslatedMDX } from '@/components/TranslatedMDX';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const lang = params.lang;

  const page = source.getPage(params.slug, lang);
  if (!page) notFound();

  // Load language-specific content for display
  const languageContent = await loadContentForLanguage(params.slug || [], lang);

  // Use language-specific content if available, otherwise fall back to original
  const pageTitle = languageContent.title || page.data.title;
  const pageDescription = languageContent.description || page.data.description;

  // Generate TOC from translated content if available, otherwise use original
  const translatedTOC = languageContent.exists && languageContent.content
    ? generateTOCFromContent(languageContent.content)
    : page.data.toc;

  // Use original MDX component - Fumadocs handles i18n automatically
  const MDX = page.data.body;

  return (
    <DocsPage toc={translatedTOC} full={page.data.full}>
      <DocsTitle>{pageTitle}</DocsTitle>
      <DocsDescription>{pageDescription}</DocsDescription>
      <DocsBody>
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

  // Load language-specific content for metadata
  const languageContent = await loadContentForLanguage(params.slug || [], lang);

  // Use translated title and description for SSR
  const pageTitle = languageContent.title || page.data.title;
  const pageDescription = languageContent.description || page.data.description;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
