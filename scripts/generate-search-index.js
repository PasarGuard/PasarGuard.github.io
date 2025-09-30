const { readFile, writeFile, mkdir } = require('fs/promises');
const { join } = require('path');
const matter = require('gray-matter');

// Simple search function (same as in the API route)
function searchContent(query, index) {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  return index
    .map(item => {
      const searchableText = `${item.title} ${item.description} ${item.content}`.toLowerCase();
      const score = searchTerms.reduce((score, term) => {
        if (item.title.toLowerCase().includes(term)) return score + 3;
        if (item.description.toLowerCase().includes(term)) return score + 2;
        if (item.content.toLowerCase().includes(term)) return score + 1;
        return score;
      }, 0);
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Limit to 20 results
}

// Helper function to get all MDX files recursively
async function getAllMdxFiles(dir) {
  const files = [];
  
  try {
    const { readdir } = await import('fs/promises');
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getAllMdxFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

// Generate search index from content
async function generateSearchIndex() {
  const languages = ['en', 'fa', 'ru', 'zh'];
  const index = [];
  
  for (const lang of languages) {
    const contentPath = join(process.cwd(), 'content', 'docs', lang);
    
    try {
      // Read all MDX files recursively
      const files = await getAllMdxFiles(contentPath);
      
      for (const file of files) {
        try {
          const fileContent = await readFile(file, 'utf-8');
          const { data: frontmatter, content } = matter(fileContent);
          
          // Generate URL from file path
          const relativePath = file.replace(contentPath, '').replace(/\\/g, '/');
          const slug = relativePath.replace(/^\//, '').replace(/\.mdx$/, '');
          const url = `/${lang}/docs/${slug}`;
          
          index.push({
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            content: content,
            url: url,
            locale: lang,
            slug: slug
          });
        } catch (error) {
          console.warn(`Failed to process file ${file}:`, error);
        }
      }
    } catch (error) {
      console.warn(`Failed to read content for language ${lang}:`, error);
    }
  }
  
  return index;
}

// Generate search index and save it
async function main() {
  try {
    console.log('Generating search index...');
    const index = await generateSearchIndex();
    
    // Ensure the public directory exists
    await mkdir(join(process.cwd(), 'public'), { recursive: true });
    
    // Save the search index as a JSON file
    const indexPath = join(process.cwd(), 'public', 'search-index.json');
    await writeFile(indexPath, JSON.stringify(index, null, 2));
    
    console.log(`Search index generated with ${index.length} items`);
    console.log(`Saved to: ${indexPath}`);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

main();
