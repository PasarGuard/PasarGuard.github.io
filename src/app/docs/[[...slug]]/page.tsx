import { redirect } from 'next/navigation';

export default async function DocsSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  
  // Redirect to English docs with the same slug
  const path = slug && slug.length > 0 ? `/en/docs/${slug.join('/')}` : '/en/docs';
  redirect(path);
}
