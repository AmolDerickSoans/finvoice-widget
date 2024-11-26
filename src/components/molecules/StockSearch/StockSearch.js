import { h } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';

// Utility for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const HintMessage = ({ isNavigating }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsVisible(false);
    
    // Short delay before showing new message for smooth exit animation
    const timer = setTimeout(() => {
      setMessage(isNavigating ? 'Press ↵ to select' : 'Press ↑ ↓ on keyboard to highlight');
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [isNavigating]);

  return (
    <div class="relative h-[24px] overflow-hidden">
      <span 
        class={cn(
          'absolute left-0 transition-all duration-300 ease-[cubic-bezier(0.175, 0.885, 0.32, 1.275)]',
          isVisible
            ? 'transform-none opacity-100'
            : 'translate-y-full opacity-0'
        )}
      >
        {message}
      </span>
    </div>
  );
};

const StockSearch = ({ 
  stocks = [],
  searchString = '',
  onSelect,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset selection when search string changes
  useEffect(() => {
    setSelectedIndex(-1);
    setIsNavigating(false);
  }, [searchString]);

  // Filter stocks based on search string
  const filteredStocks = useMemo(() => {
    if (!searchString) return stocks;
    const search = searchString.toLowerCase();
    return stocks.filter(stock => 
      stock.stockName.toLowerCase().includes(search) || 
      stock.tickerSymbol.toLowerCase().includes(search)
    );
  }, [stocks, searchString]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredStocks.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsNavigating(true);
        setSelectedIndex(current => {
          if (current === -1) return 0;
          return e.key === 'ArrowDown'
            ? (current + 1) % filteredStocks.length
            : (current - 1 + filteredStocks.length) % filteredStocks.length;
        });
      }

      if (e.key === 'Enter' && selectedIndex !== -1) {
        e.preventDefault();
        onSelect(filteredStocks[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredStocks, selectedIndex, onSelect]);

  return (
    <div class={cn('w-full bg-white rounded-lg shadow-lg overflow-hidden', className)}>
      {/* Search header */}
      <div class="p-2 text-sm text-gray-500 border-b">
        searching for "{searchString}"...
      </div>

      {/* Stock list */}
      <div class="max-h-[300px] overflow-y-auto">
        {filteredStocks.map((stock, index) => (
          <div
            key={stock.tickerSymbol}
            onClick={() => onSelect(stock)}
            class={cn(
              'p-3 cursor-pointer transition-colors duration-150',
              selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50',
              index !== filteredStocks.length - 1 && 'border-b'
            )}
          >
            <div class="font-medium">{stock.stockName}</div>
            <div class="text-sm text-gray-500">{stock.tickerSymbol}</div>
          </div>
        ))}
        {filteredStocks.length === 0 && (
          <div class="p-3 text-sm text-gray-500">
            No results found
          </div>
        )}
      </div>

      {/* Hint message with animation */}
      <div class="p-3 bg-gray-700 text-white text-sm">
        <HintMessage isNavigating={isNavigating} />
      </div>
    </div>
  );
};

export default StockSearch;