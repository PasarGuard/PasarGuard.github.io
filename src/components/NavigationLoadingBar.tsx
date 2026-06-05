'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const NAVIGATION_LOADING_EVENT = 'pasarguard:navigation-loading';

export function startNavigationLoading() {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(NAVIGATION_LOADING_EVENT));
}

function shouldStartForLink(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;

  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin) return false;

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const isSamePage = url.pathname === currentPath && url.search === currentSearch;

  if (isSamePage) return false;

  return true;
}

export function NavigationLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const isVisibleRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearInterval(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (finishTimerRef.current) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    if (!isVisibleRef.current) return;

    clearTimers();
    setProgress(100);

    finishTimerRef.current = window.setTimeout(() => {
      isVisibleRef.current = false;
      setIsVisible(false);
      setProgress(0);
    }, 250);
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    isVisibleRef.current = true;
    setIsVisible(true);
    setProgress(12);

    window.requestAnimationFrame(() => {
      setProgress(55);
    });

    advanceTimerRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 88) return current;
        return current + Math.max(2, (90 - current) * 0.08);
      });
    }, 450);

    fallbackTimerRef.current = window.setTimeout(finish, 8000);
  }, [clearTimers, finish]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      if (shouldStartForLink(event, anchor)) {
        start();
      }
    };

    const handlePopState = () => {
      start();
    };

    window.addEventListener(NAVIGATION_LOADING_EVENT, start);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true);

    return () => {
      clearTimers();
      window.removeEventListener(NAVIGATION_LOADING_EVENT, start);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, [clearTimers, start]);

  useEffect(() => {
    finish();
  }, [finish, pathname, search]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-0.5 overflow-hidden"
    >
      <div
        className="h-full origin-left bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.65)] transition-[transform,opacity] duration-300 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  );
}
