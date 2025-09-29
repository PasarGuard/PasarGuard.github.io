import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
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

// Alert component
function Alert({ type = "info", icon, children }: { type?: "info" | "warning" | "error" | "success"; icon?: string; children: React.ReactNode }) {
  const typeStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
  };

  return (
    <div className={`border rounded-lg p-4 my-4 ${typeStyles[type]}`}>
      {children}
    </div>
  );
}

// Field component for configuration
function Field({ name, type, defaultValue, children }: { name: string; type: string; defaultValue?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{name}</code>
        <span className="text-sm text-gray-500 dark:text-gray-400">{type}</span>
        {defaultValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            default: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{defaultValue}</code>
          </span>
        )}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Step,
    Steps,
    Cards,
    Card,
    Alert,
    Field,
    ...components,
  };
}
