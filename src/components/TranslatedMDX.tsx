import React from 'react';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { marked } from 'marked';

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

  // Parse the content to handle Cards components and convert to JSX
  const parseContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={i} className="text-lg font-semibold mt-4 mb-2">
            {line.replace('#### ', '')}
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
        elements.push(
          <pre key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto" dir="ltr" style={{ textAlign: 'left' }}>
            <code className={`language-${language}`} dir="ltr" style={{ textAlign: 'left' }}>
              {codeLines.join('\n')}
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
        
        // Parse cards using MDX components
        const cards = cardLines.map((cardLine, index) => {
          const titleMatch = cardLine.match(/title="([^"]+)"/);
          const hrefMatch = cardLine.match(/href="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : '';
          const href = hrefMatch ? hrefMatch[1] : '#';
          
          const CardComponent = mdxComponents.Card as React.ComponentType<{ title: string; href: string; children?: React.ReactNode }>;
          return (
            <CardComponent
              key={`card-${i}-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`}
              title={title}
              href={href}
            />
          );
        });
        
        const CardsComponent = mdxComponents.Cards as React.ComponentType<{ children: React.ReactNode }>;
        elements.push(
          <CardsComponent key={i}>
            {cards}
          </CardsComponent>
        );
      } else if (line && !line.startsWith('<')) {
        // Regular paragraph - use marked for proper markdown parsing
        const htmlContent = marked(line);
        elements.push(
          <div 
            key={i} 
            className="mb-4 prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      }
      
      i++;
    }
    
    return elements;
  };

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {parseContent(content)}
    </div>
  );
}