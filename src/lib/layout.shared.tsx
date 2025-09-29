import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { CompactControls } from '@/components/CompactControls';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions() {
  return {
    nav: {
      title: (
        <>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo"
          >
            <circle cx={12} cy={12} r={12} fill="currentColor" />
          </svg>
          My App
        </>
      ),
      children: null,
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
    sidebar: {
      footer: (
        <div className="flex items-center justify-between w-full">
          <CompactControls />
        </div>
      ),
    },
  };
}
