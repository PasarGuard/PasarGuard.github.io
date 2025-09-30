interface SearchIndexItem {
  title: string;
  description: string;
  content: string;
  url: string;
  locale: string;
  slug: string;
}

interface SearchResult extends SearchIndexItem {
  score: number;
}

interface SearchResponse {
  hits: SearchResult[];
  count: number;
  elapsed: number;
}

// Simple search function (same as in the API route)
function searchContent(query: string, index: SearchIndexItem[]): SearchResult[] {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  return index
    .map(item => {
      const score = searchTerms.reduce((score, term) => {
        if (item.title.toLowerCase().includes(term)) return score + 3;
        if (item.description.toLowerCase().includes(term)) return score + 2;
        if (item.content.toLowerCase().includes(term)) return score + 1;
        return score;
      }, 0);
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Limit to 20 results
}

// Cache for the search index
let searchIndexCache: SearchIndexItem[] | null = null;

// Load search index from static file
async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) {
      throw new Error('Failed to load search index');
    }
    const data = await response.json();
    searchIndexCache = data as SearchIndexItem[];
    return searchIndexCache;
  } catch (error) {
    console.error('Error loading search index:', error);
    return [];
  }
}

// Main search function
export async function search(query: string, locale?: string): Promise<SearchResponse> {
  const startTime = Date.now();
  
  if (!query.trim()) {
    return {
      hits: [],
      count: 0,
      elapsed: 0
    };
  }

  try {
    // Load search index
    const index = await loadSearchIndex();
    
    // Perform search
    let results = searchContent(query, index);
    
    // Filter by locale if specified
    if (locale) {
      results = results.filter(result => result.locale === locale);
    }
    
    const elapsed = Date.now() - startTime;
    
    return {
      hits: results,
      count: results.length,
      elapsed
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      hits: [],
      count: 0,
      elapsed: 0
    };
  }
}
