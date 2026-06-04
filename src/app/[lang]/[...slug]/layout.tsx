import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { CompactControls } from '@/components/CompactControls';
import { CustomSearch } from '@/components/CustomSearch';
import Link from 'next/link';

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Get the page tree for the specific language
  const tree = source.pageTree[lang] || source.pageTree['en'];

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions(lang)}
      searchToggle={{
        enabled: true,
        components: {
          sm: <CustomSearch isMobile locale={lang} />,
          lg: <CustomSearch locale={lang} />
        }
      }}
      sidebar={{
        footer: (
          <div className="flex flex-col gap-3 w-full p-2 sm:p-3">
            {/* GitHub Info - Responsive layout */}
            <div className="flex items-center justify-center sm:justify-start">
              <div dir='ltr' className="w-full">
                <Link
                  href="https://github.com/PasarGuard/panel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub: PasarGuard/panel
                </Link>
              </div>
            </div>

            {/* Controls - Always visible, responsive design */}
            <CompactControls />
          </div>
        ),
      }}
    >
  { children }
    </DocsLayout >
  );
}
