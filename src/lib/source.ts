import { docs } from '@/.source';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { i18n } from './i18n';
import { 
  Home, 
  Download, 
  Rocket, 
  Monitor, 
  Server, 
  Terminal, 
  ArrowRightLeft 
} from 'lucide-react';
import { createElement } from 'react';

// Icon handler to convert icon names to JSX elements
const iconHandler = (icon: string | undefined) => {
  if (!icon) return createElement(Home, { className: "h-4 w-4" });
  
  const iconMap = {
    Home,
    Download,
    Rocket,
    Monitor,
    Server,
    Terminal,
    ArrowRightLeft,
  };
  
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  return IconComponent ? createElement(IconComponent, { className: "h-4 w-4" }) : createElement(Home, { className: "h-4 w-4" });
};

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
  icon: iconHandler,
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

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
