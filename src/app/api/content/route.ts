import { getPreferredLanguage } from '@/lib/language-utils';
import { loadContentForLanguage } from '@/lib/content-loader';

export const revalidate = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '';
  const language = getPreferredLanguage(request);
  
  try {
    const slugArray = slug ? slug.split('/') : [];
    const content = await loadContentForLanguage(slugArray, language);
    
    return new Response(JSON.stringify({
      success: true,
      language,
      content: {
        title: content.title,
        description: content.description,
        content: content.content,
        exists: content.exists,
      },
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Language': language,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to load content',
      language,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Language': language,
      },
    });
  }
}
