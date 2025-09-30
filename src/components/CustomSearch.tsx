'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/lib/use-translations';
import { search } from '@/lib/static-search';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  locale: string;
  slug: string;
  score: number;
}

interface CustomSearchProps {
  locale: string;
}

export function CustomSearch({ locale }: CustomSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  
  // Load translations using client-side hook
  const { t } = useTranslations();
  const isRTL = ['fa', 'ar'].includes(locale);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = useCallback((url: string) => {
    window.location.href = url;
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex].url);
        }
        break;
    }
  }, [isOpen, results, selectedIndex, handleResultClick]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    try {
      const data = await search(searchQuery, locale);
      setResults(data.hits || []);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSelectedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce search
    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  }, [handleSearch]);

  // Open search with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button - Fumadocs Style */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground",
          "hover:text-foreground transition-colors duration-200",
          "border border-border rounded-md bg-background/50 hover:bg-background",
          "hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "min-w-[200px] justify-start",
          isRTL && "flex-row-reverse"
        )}
        aria-label={t('search.button')}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Search className="h-4 w-4 flex-shrink-0" />
        <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
          {t('search.placeholder')}
        </span>
        <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </button>

      {/* Search Modal - Fumadocs Style */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-center pt-[10vh] px-4">
            <div 
              className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Search Input */}
              <div className={cn("flex items-center gap-3 p-4 border-b border-border", isRTL && "flex-row-reverse")}>
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t('search.placeholder')}
                  className={cn(
                    "flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm",
                    isRTL ? "text-right" : "text-left"
                  )}
                  autoComplete="off"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    setResults([]);
                    setSelectedIndex(-1);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Results */}
              <div 
                ref={resultsRef}
                className="max-h-[60vh] overflow-y-auto"
              >
                {isLoading && (
                  <div className="p-6 text-center text-muted-foreground">
                    <div className={cn("inline-flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                      {t('search.searching')}
                    </div>
                  </div>
                )}

                {!isLoading && query && results.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <div className={cn("text-sm font-medium", isRTL && "text-right")}>
                        {t('search.noResults')}
                      </div>
                      <div className={cn("text-xs", isRTL && "text-right")}>
                        {t('search.noResultsDescription')}
                      </div>
                    </div>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <button
                        key={`${result.url}-${index}`}
                        onClick={() => handleResultClick(result.url)}
                        className={cn(
                          "w-full text-left p-3 transition-colors duration-150",
                          "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                          selectedIndex === index && "bg-muted/50"
                        )}
                      >
                        <div className={cn("space-y-1", isRTL && "text-right")}>
                          <div className={cn("font-medium text-sm text-foreground line-clamp-1", isRTL && "text-right")}>
                            {result.title}
                          </div>
                          {result.description && (
                            <div className={cn("text-xs text-muted-foreground line-clamp-2", isRTL && "text-right")}>
                              {result.description}
                            </div>
                          )}
                          <div dir='ltr' className={cn("text-xs text-muted-foreground/70 font-mono", isRTL && "text-right")}>
                            {result.url}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="p-6 text-center text-muted-foreground">
                    <div className={cn("space-y-3", isRTL && "text-right")}>
                      <div className={cn("text-sm font-medium", isRTL && "text-right")}>
                        {t('search.title')}
                      </div>
                      <div className={cn("text-xs space-y-1", isRTL && "text-right")}>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          {t('search.instructions')}
                        </div>
                        <div className={cn("flex items-center justify-center gap-4 text-xs", isRTL && "flex-row-reverse")}>
                          <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                            <Command className="h-3 w-3" />
                            <span>K</span>
                            <span>{t('search.shortcuts.search')}</span>
                          </span>
                          <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                            <span>↑↓</span>
                            <span>{t('search.shortcuts.navigate')}</span>
                          </span>
                          <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                            <span>↵</span>
                            <span>{t('search.shortcuts.select')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
