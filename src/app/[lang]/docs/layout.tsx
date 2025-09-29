import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { CompactControls } from '@/components/CompactControls';
import { GithubInfo } from 'fumadocs-ui/components/github-info';

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
          <div className="flex flex-col gap-3 w-full p-2 sm:p-3">
            {/* GitHub Info - Responsive layout */}
            <div className="flex items-center justify-center sm:justify-start">
              <div dir='ltr' className="w-full">
                <GithubInfo
                  owner="Pasarguard"
                  repo="panel"
                />
              </div>
            </div>

            {/* Controls - Always visible, responsive design */}
            <div className="flex items-center justify-center sm:justify-end">
              <CompactControls />
            </div>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}