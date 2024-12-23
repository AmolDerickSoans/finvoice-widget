import { h } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { Search } from 'lucide-preact';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);


  const searchStocks = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:4000/stocks`);
      const data = await response.json();
      
      // Convert search query to lowercase for case-insensitive matching
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) {
        setResults([]);
        return;
      }
  
      // Score-based matching system
      const scoredResults = data.map(stock => {
        const ticker = stock.ticker.toLowerCase();
        const name = stock.name.toLowerCase();
        let score = 0;
        
        // Exact matches (highest priority)
        if (ticker === query) score += 100;
        if (name === query) score += 90;
        
        // Ticker-based matches
        if (ticker.startsWith(query)) score += 80;
        if (ticker.includes(query)) score += 70;
        
        // Name-based matches
        if (name.startsWith(query)) score += 60;
        if (name.includes(query)) score += 50;
        
        // Word boundary matches in name (e.g., "App" matching "Apple Inc")
        const words = name.split(/\s+/);
        if (words.some(word => word.startsWith(query))) score += 40;
        
        // Acronym matching (e.g., "ms" matching "Morgan Stanley")
        const nameAcronym = words.map(word => word[0]).join('').toLowerCase();
        if (nameAcronym.includes(query)) score += 30;
        
        // Fuzzy matching for typos (using Levenshtein distance)
        const tickerDist = levenshteinDistance(ticker, query);
        const nameDist = levenshteinDistance(name, query);
        if (tickerDist <= 2) score += (20 - tickerDist * 5);
        if (nameDist <= 2) score += (15 - nameDist * 5);
  
        return { ...stock, score };
      });
  
      // Filter out results with no relevance and sort by score
      const filteredResults = scoredResults
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
  
      setResults(filteredResults);
    } catch (err) {
      setError('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to calculate Levenshtein distance for fuzzy matching
  const levenshteinDistance = (str1, str2) => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return track[str2.length][str1.length];
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      searchStocks(value); // Call search function immediately
    } else {
      setResults([]); // Clear results if input is less than 2 characters
    }
  };

  const toggleDropdown = (e) => {
    setIsOpen(e && e.target === inputRef.current);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onInput={handleInputChange}
          onClick={handleInputClick}
          className="w-full rounded-md border px-3 py-2 pr-10"
          placeholder="Search stocks..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {isOpen && query.length >= 2 && (
        <div className="z-50 absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
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