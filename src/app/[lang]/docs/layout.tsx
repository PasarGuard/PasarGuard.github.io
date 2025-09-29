import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { CompactControls } from '@/components/CompactControls';

export default async function Layout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // Get the page tree for the specific locale
  const tree = source.pageTree[lang] || source.pageTree;
  
  return (
    <DocsLayout 
      tree={tree} 
      {...baseOptions(lang)}
      sidebar={{
        footer: (
          <div className="flex items-center justify-between w-full">
            <CompactControls />
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
