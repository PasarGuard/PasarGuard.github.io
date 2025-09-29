import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { loadContentForLanguage } from '@/lib/content-loader';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; slug: string[] }> },
) {
  const { slug, locale } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  // Load language-specific content for OG image
  const languageContent = await loadContentForLanguage(slug.slice(0, -1), locale);
  
  // Use translated title/description if available, otherwise fall back to default
  const title = languageContent.title || page.data.title;
  const description = languageContent.description || page.data.description;

  return new ImageResponse(
    (
      <DefaultImage
        title={title}
        description={description}
        site="My App"
      />
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  const pages = source.getPages();
  const locales = ['en', 'fa', 'ru', 'zh'];
  
  // Generate static params for all locales and pages
  const params = [];
  for (const locale of locales) {
    for (const page of pages) {
      params.push({
        locale,
        slug: getPageImage(page).segments,
      });
    }
  }
  
  return params;
}
