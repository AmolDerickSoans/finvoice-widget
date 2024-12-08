import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import KeyboardNavigationHint from '../../atoms/KeyNavToast/KeyNavToast'

const StockSearchDropdown = ({ 
  isSearchAnimating,
  filteredStocks = [],
  selectedSearchIndex,
  onStockSelect,
  searchQuery,
  inputRefs,
  showStockSearch 
}) => {
  // Helper function to check if current search matches any stock exactly
  const isExactMatch = (query) => {
    return filteredStocks.some(stock => 
      stock.tickerSymbol.toLowerCase() === query.toLowerCase() ||
      stock.stockName.toLowerCase() === query.toLowerCase()
    );
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery && isExactMatch(searchQuery)) {
      // Find the matching stock
      const matchingStock = filteredStocks.find(stock => 
        stock.tickerSymbol.toLowerCase() === searchQuery.toLowerCase() ||
        stock.stockName.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (matchingStock) {
        onStockSelect(matchingStock);
        inputRefs.price.current?.focus();
      }
    }
  };

  // Add event listener for keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, filteredStocks]);

  return (
    <div 
      class={`
        mt-2 
        origin-top 
        bg-white 
        border 
        rounded-md 
        shadow-lg
        h-80
        flex
        flex-col
        ${isSearchAnimating ? 'search-enter' : 'search-exit'}
      `}
    >
      {/* Header */}
      <div class="text-sm text-gray-500 p-2 bg-gray-50 border-b flex-none">
        {!searchQuery && "Type to search stocks..."}
        {searchQuery && searchQuery.length < 3 && "Type 3 or more characters to search..."}
        {searchQuery && searchQuery.length >= 3 && `${filteredStocks.length} stocks found`}
      </div>

      {/* Content */}
      <div class="flex-1 overflow-y-auto">
        {filteredStocks.length === 0 && searchQuery && searchQuery.length >= 3 ? (
          <div class="h-full flex items-center justify-center">
            <p class="text-sm text-gray-500">No stocks found</p>
          </div>
        ) : (
          filteredStocks.map((stock, index) => (
            <div
              key={stock.tickerSymbol}
              class={`
                p-3 
                cursor-pointer 
                border-b
                transition-colors
                ${selectedSearchIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'}
                ${stock.tickerSymbol.toLowerCase() === searchQuery.toLowerCase() ? 'bg-blue-50' : ''}
              `}
              onClick={() => {
                onStockSelect(stock);
                inputRefs.price.current?.focus();
              }}
            >
              <div class="font-medium">{stock.tickerSymbol}</div>
              <div class="text-sm text-gray-500">{stock.stockName}</div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <KeyboardNavigationHint />
    </div>
  );
};

export default StockSearchDropdown;