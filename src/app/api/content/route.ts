import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const languageContentMap = {
  en: 'content/translations/en',
  fa: 'content/translations/fa',
  ru: 'content/translations/ru', 
  zh: 'content/translations/zh',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'en';

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const slugArray = slug.split('/').filter(Boolean);
  const contentPath = languageContentMap[locale as keyof typeof languageContentMap] || languageContentMap.en;
  const filePath = join(process.cwd(), contentPath, `${slugArray.join('/') || 'index'}.mdx`);
  
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    return NextResponse.json({
      title: frontmatter.title,
      description: frontmatter.description,
      content: content,
      exists: true,
    });
  } catch (error) {
    // Fall back to English if language-specific content doesn't exist
    if (locale !== 'en') {
      const englishContentPath = languageContentMap.en;
      const englishFilePath = join(process.cwd(), englishContentPath, `${slugArray.join('/') || 'index'}.mdx`);
      
      try {
        const fileContent = await readFile(englishFilePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        
        return NextResponse.json({
          title: frontmatter.title,
          description: frontmatter.description,
          content: content,
          exists: true,
        });
      } catch (englishError) {
        return NextResponse.json({
          title: 'Page Not Found',
          description: 'Content not found',
          content: '# Page Not Found\n\nThis content is not available in the selected language.',
          exists: false,
        });
      }
    }
    
    return NextResponse.json({
      title: 'Page Not Found',
      description: 'Content not found',
      content: '# Page Not Found\n\nThis content is not available in the selected language.',
      exists: false,
    });
  }
}