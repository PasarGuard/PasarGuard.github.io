import { docs } from '@/.source';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { i18n } from './i18n';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.vercel.app/headless/source-api for more info
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  i18n,
  icon(icon) {
    if (!icon) {
      // Return undefined for no default icon
      return;
    }
    if (icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
});




export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

// Helper function to get locale from pathname
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  return ['en', 'fa', 'ru', 'zh'].includes(locale) ? locale : 'en';
}
