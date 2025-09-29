import React, { useMemo } from 'react';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { marked } from 'marked';

// Configure marked for consistent output
marked.setOptions({
  gfm: true,
  breaks: false,
  pedantic: false,
});

interface TranslatedMDXProps {
  content: string;
  page?: any; // Optional page object for relative links
}

export function TranslatedMDX({ content, page }: TranslatedMDXProps) {
  // Get MDX components with relative link support
  const mdxComponents = getMDXComponents({
    // Add relative link support if page is provided
    ...(page ? { a: createRelativeLink(source, page) } : {}),
  });

  // Memoize the parsed content to ensure consistency between server and client
  const parsedContent = useMemo(() => {
    // Early return if content is empty
    if (!content || content.trim() === '') {
      return [];
    }
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      const lineIndex = i; // Store the current line index for consistent keys
      
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '');
        elements.push(
          <h2 key={`h2-${lineIndex}-${title.slice(0, 20)}`} className="text-2xl font-bold mt-8 mb-4">
            {title}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const title = line.replace('### ', '');
        elements.push(
          <h3 key={`h3-${lineIndex}-${title.slice(0, 20)}`} className="text-xl font-semibold mt-6 mb-3">
            {title}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        const title = line.replace('#### ', '');
        elements.push(
          <h4 key={`h4-${lineIndex}-${title.slice(0, 20)}`} className="text-lg font-semibold mt-4 mb-2">
            {title}
          </h4>
        );
      } else if (line.startsWith('```')) {
        // Handle code blocks
        const language = line.replace('```', '');
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeContent = codeLines.join('\n');
        elements.push(
          <pre key={`code-${lineIndex}-${language}`} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto" dir="ltr" style={{ textAlign: 'left', padding: '0.25rem' }}>
            <code className={`language-${language}`} dir="ltr" style={{ textAlign: 'left' }}>
              {codeContent}
            </code>
          </pre>
        );
      } else if (line.startsWith('<Cards>')) {
        // Handle Cards component
        const cardLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Cards>')) {
          if (lines[i].trim().startsWith('<Card')) {
            cardLines.push(lines[i].trim());
          }
          i++;
        }
        
        // Parse cards using MDX components with stable keys
        const cards = cardLines.map((cardLine, index) => {
          const titleMatch = cardLine.match(/title="([^"]+)"/);
          const hrefMatch = cardLine.match(/href="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : '';
          const href = hrefMatch ? hrefMatch[1] : '#';
          
          // Create a stable key based on title and href
          const stableKey = `card-${lineIndex}-${index}-${title.slice(0, 10)}-${href.slice(0, 10)}`;
          
          const CardComponent = mdxComponents.Card as React.ComponentType<{ title: string; href: string; children?: React.ReactNode }>;
          return (
            <CardComponent
              key={stableKey}
              title={title}
              href={href}
            />
          );
        });
        
        const CardsComponent = mdxComponents.Cards as React.ComponentType<{ children: React.ReactNode }>;
        elements.push(
          <CardsComponent key={`cards-${lineIndex}`}>
            {cards}
          </CardsComponent>
        );
      } else if (line && !line.startsWith('<')) {
        // Regular paragraph - use marked for proper markdown parsing
        // Create a stable key based on content hash
        const contentHash = line.slice(0, 30).replace(/\s+/g, '-');
        const htmlContent = marked(line);
        elements.push(
          <div 
            key={`p-${lineIndex}-${contentHash}`}
            className="mb-4 prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      }
      
      i++;
    }
    
    return elements;
  }, [content, mdxComponents]);

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {parsedContent}
    </div>
  );
}