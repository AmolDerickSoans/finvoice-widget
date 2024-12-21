import  {h ,useState, useEffect } from 'preact';
import { Search } from 'lucide-peact';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        searchStocks(query);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const searchStocks = async (searchQuery) => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/stocks/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border px-3 py-2 pr-10"
          placeholder="Search stocks..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {query.length >= 2 && (
        <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
          {loading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-2 text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="p-2 text-gray-500">No results found</div>
          ) : (
            results.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelect(stock)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{stock.symbol}</div>
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