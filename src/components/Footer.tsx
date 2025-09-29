'use client';

import Link from 'next/link';
import { Github, Heart } from 'lucide-react';
import { useTranslations } from '@/lib/use-translations';

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const { t } = useTranslations();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer dir='ltr' className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear}Made with{' '}
              <Heart className="inline h-4 w-4 text-red-500" /> in PasarGuard Team
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/PasarGuard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              {t('github')}
            </Link>
            <Link
              href="https://github.com/PasarGuard/panel/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Releases
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('documentation')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
