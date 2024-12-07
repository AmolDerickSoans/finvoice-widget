import { h, Fragment } from 'preact';

const StockSearchDropdown = ({ 
  isSearchAnimating,
  isFocused,
  searchQuery,
  filteredStocks,
  selectedSearchIndex,
  onStockSelect,
  inputRefs,
  showStockSearch
}) => {
  // Don't render anything if not focused or no search query
  if (!showStockSearch && !searchQuery) return null;

  const renderSearchResults = () => (
    <div class="overflow-y-auto" style={{ minHeight: '120px', maxHeight: '40vh' }}>
      {filteredStocks.map((stock, index) => (
        <div
          key={stock.tickerSymbol}
          class={`p-3 cursor-pointer border-b ${
            selectedSearchIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            onStockSelect(stock);
            inputRefs.price.current?.focus();
          }}
        >
          <div class="font-medium">{stock.tickerSymbol}</div>
          <div class="text-sm text-gray-500">{stock.stockName}</div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div class="text-sm text-gray-500 p-4 text-center min-h-[120px] flex items-center justify-center">
      {!searchQuery 
        ? "Enter stock name or symbol"
        : "No stocks found"
      }
    </div>
  );

  if (!isFocused) return null;

  return (
    <div 
      class={`
        mt-2 
        origin-top 
        bg-white 
        border 
        rounded-md 
        shadow-lg
        ${isSearchAnimating ? 'search-enter' : 'search-exit'}
      `}
    >
      {searchQuery && filteredStocks.length < 3 && (
        <div class="text-sm text-gray-500 p-2 bg-gray-50 border-b">
          Type 3 letters to filter the list...
        </div>
      )}
      
      {filteredStocks.length > 0 ? renderSearchResults() : renderEmptyState()}
      
      {filteredStocks.length > 0 && (
        <div class="text-sm text-white bg-gray-700 p-2">
          Press ↑ ↓ on keyboard to choose
        </div>
      )}
    </div>
  );
};

export default StockSearchDropdown;