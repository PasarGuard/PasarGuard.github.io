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

    // For complex MDX with nested components, use a simpler approach
    // Parse the entire content as markdown and wrap it in the necessary components
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      const lineIndex = i;

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
      } else if (line.startsWith('<Alert')) {
        // Handle Alert component
        const typeMatch = line.match(/type="([^"]+)"/);
        const alertType = typeMatch ? typeMatch[1] : 'info';

        // Collect all content until </Alert>
        const alertContent: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('</Alert>')) {
          alertContent.push(lines[i]);
          i++;
        }

        // Join content and create a simple alert-like structure
        const alertText = alertContent.join('\n');

        const AlertComponent = mdxComponents.Alert as React.ComponentType<{ type?: string; children: React.ReactNode }>;
        elements.push(
          <AlertComponent key={`alert-${lineIndex}`} type={alertType}>
            <div dangerouslySetInnerHTML={{ __html: marked(alertText) }} />
          </AlertComponent>
        );
      } else if (line.includes('<Steps>') || line.includes('<Tabs') || line.includes('<Tab')) {
        // For complex nested components, render the entire content as a single prose block
        // This handles Steps, Tabs, and other complex nested structures
        const complexContentStart = i;
        let nestingLevel = 0;

        // Find the end of the complex component structure
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (currentLine.includes('<Steps>') || currentLine.includes('<Tabs')) {
            nestingLevel++;
          } else if (currentLine.includes('</Steps>') || currentLine.includes('</Tabs>')) {
            nestingLevel--;
            if (nestingLevel === 0) {
              i++; // Include the closing tag
              break;
            }
          }
          i++;
        }

        // Extract the complex content block
        const complexContent = lines.slice(complexContentStart, i).join('\n');

        // Render as prose with proper styling
        elements.push(
          <div
            key={`complex-${lineIndex}`}
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(complexContent) }}
          />
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