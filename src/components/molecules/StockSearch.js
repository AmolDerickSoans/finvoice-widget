import {h} from 'preact' 
import { useState, useRef, useCallback, useMemo , useEffect } from 'preact/hooks';
import { Search } from 'lucide-preact';
import { debounce } from 'lodash';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const cacheRef = useRef({
    apiData: null,
    lastFetch: null
  });

  // Cache duration - 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Memoized scoring function
  const scoreResult = useMemo(() => (stock, searchQuery) => {
    const ticker = stock.ticker.toLowerCase();
    const name = stock.name.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    
    // Early return for exact matches
    if (ticker === query) return 100;
    if (name === query) return 90;
    
    let score = 0;
    
    // Prioritize prefix matches
    if (ticker.startsWith(query)) score += 80;
    else if (name.startsWith(query)) score += 60;
    
    // Simple inclusion matches
    if (ticker.includes(query)) score += 40;
    if (name.includes(query)) score += 20;
    
    return score;
  }, []);

  // Memoized search function
  const searchStocks = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Check cache validity
      const now = Date.now();
      if (!cacheRef.current.apiData || 
          !cacheRef.current.lastFetch || 
          now - cacheRef.current.lastFetch > CACHE_DURATION) {
        const response = await fetch('http://localhost:4000/stocks');
        const data = await response.json();
        cacheRef.current = {
          apiData: data,
          lastFetch: now
        };
      }

      const data = cacheRef.current.apiData;
      
      // Score and filter results
      const scoredResults = data
        .map(stock => ({
          ...stock,
          score: scoreResult(stock, searchQuery)
        }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setResults(scoredResults);
    } catch (err) {
      setError('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  }, [scoreResult]);

  // Debounced search with 300ms delay
  const debouncedSearch = useMemo(
    () => debounce(searchStocks, 300),
    [searchStocks]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onInput={handleInputChange}
          onClick={() => setIsOpen(true)}
          className="w-full rounded-md border px-3 py-2 pr-10"
          placeholder="Search stocks..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
          {loading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-2 text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="p-2 text-gray-500">No results found</div>
          ) : (
            results.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => {
                  onSelect(stock);
                  setQuery(stock.name);
                  setResults([]);
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{stock.ticker}</div>
                <div className="text-sm text-gray-600">{stock.name}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;