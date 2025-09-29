import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// Custom Cards component for Fumadocs
function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {children}
    </div>
  );
}

function Card({ title, href, children }: { title: string; href: string; children?: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </a>
  );
}

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Cards,
    Card,
    ...components,
  };
}
