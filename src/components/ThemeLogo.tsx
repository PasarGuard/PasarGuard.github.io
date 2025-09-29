'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ThemeLogo({ className = '', width = 24, height = 24 }: ThemeLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR
    return (
      <div 
        className={`bg-gray-300 rounded-full ${className}`}
        style={{ width, height }}
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const logoSrc = currentTheme === 'dark' 
    ? '/static/logo.png' 
    : '/static/logo-dark.png';

  return (
    <Image
      src={logoSrc}
      alt="PasarGuard Logo"
      width={width}
      height={height}
      className={`transition-transform duration-200 hover:scale-105 ${className}`}
      priority
    />
  );
}
