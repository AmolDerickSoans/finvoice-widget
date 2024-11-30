import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import Button from '../atoms/Button/Button';
import { X } from 'lucide-react';

const NewTradeCallModal = ({ isOpen, onClose }) => {
  // State management
  const [type, setType] = useState('buy');
  const [stockSearch, setStockSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [currentFocus, setCurrentFocus] = useState(null);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);

  // Mock stock data - replace with actual API call
  const mockStocks = [
    { stockName: 'Reliance Industries Ltd', tickerSymbol: 'RELIANCE' },
    { stockName: 'Relic Technologies Ltd', tickerSymbol: 'RELICTEC' },
    { stockName: 'Reliance Infrastructure Ltd', tickerSymbol: 'RELINFRA' },
    { stockName: 'Reliable Ventures India Ltd', tickerSymbol: 'RELIABVEN' },
  ];

  const [filteredStocks, setFilteredStocks] = useState([]);

  // Refs for form inputs
  const inputRefs = {
    type: useRef(null),
    stock: useRef(null),
    price: useRef(null),
    stopLoss: useRef(null),
    target: useRef(null),
  };

  // Calculate valid fields for button progress
  const totalFields = 4; // stock, price, stopLoss, target
  const validFields = [
    selectedStock,
    price,
    stopLoss,
    target
  ].filter(Boolean).length;

  // Focus first input on modal open
  useEffect(() => {
    if (isOpen) {
      inputRefs.type.current?.focus();
    }
  }, [isOpen]);

  // Handle stock search filtering
  useEffect(() => {
    if (stockSearch.length >= 3) {
      const filtered = mockStocks.filter(stock => 
        stock.stockName.toLowerCase().includes(stockSearch.toLowerCase()) ||
        stock.tickerSymbol.toLowerCase().includes(stockSearch.toLowerCase())
      );
      setFilteredStocks(filtered);
      setShowStockSearch(true);
      setSelectedSearchIndex(-1);
    } else {
      setFilteredStocks([]);
      setShowStockSearch(false);
    }
  }, [stockSearch]);

  // Reset form
  const resetForm = () => {
    setType('buy');
    setStockSearch('');
    setSelectedStock(null);
    setPrice('');
    setStopLoss('');
    setTarget('');
    setCurrentFocus(null);
    setShowStockSearch(false);
    setSelectedSearchIndex(-1);
  };

  // Handle form submission
  const handleSubmit = () => {
    const formData = {
      type,
      stock: selectedStock,
      price,
      stopLoss,
      target
    };
    console.log('Form submitted:', formData);
    resetForm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentFocus === 'type') {
      setType(prev => prev === 'buy' ? 'sell' : 'buy');
    }

    if (showStockSearch && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setSelectedSearchIndex(prev => {
        if (e.key === 'ArrowDown') {
          return prev < filteredStocks.length - 1 ? prev + 1 : 0;
        } else {
          return prev > 0 ? prev - 1 : filteredStocks.length - 1;
        }
      });
    }

    if (e.key === 'Enter' && selectedSearchIndex >= 0) {
      e.preventDefault();
      const selectedStock = filteredStocks[selectedSearchIndex];
      setSelectedStock(selectedStock);
      setStockSearch(selectedStock.tickerSymbol);
      setShowStockSearch(false);
      inputRefs.price.current?.focus();
    }

    if (e.key === 'Escape') {
      onClose();
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      class="fixed inset-0 bg-black bg-opacity-75 gap-2 flex flex-col items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget){
            resetForm();
            onClose();
        }
      }}
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
      

        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span 
              class={`font-medium ${type === 'buy' ? 'text-green-600' : 'text-red-600'} cursor-pointer`}
              ref={inputRefs.type}
              tabIndex={0}
              onFocus={() => setCurrentFocus('type')}
              onKeyDown={handleKeyDown}
              onClick={() => setType(prev => prev === 'buy' ? 'sell' : 'buy')}
            >
              {type === 'buy' ? 'Buy' : 'Sell'}
            </span>
            <div class="relative flex-1">
              <input
                ref={inputRefs.stock}
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                onFocus={() => {
                  setCurrentFocus('stock');
                  if (stockSearch.length >= 3) {
                    setShowStockSearch(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search stocks..."
                class={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? ' focus:ring-red-500' : 'focus:ring-green-500'} `}
              />
              
              {showStockSearch && (
                <div class="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {filteredStocks.map((stock, index) => (
                    <div
                      key={stock.tickerSymbol}
                      class={`p-2 cursor-pointer ${
                        selectedSearchIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedStock(stock);
                        setStockSearch(stock.tickerSymbol);
                        setShowStockSearch(false);
                        inputRefs.price.current?.focus();
                      }}
                    >
                      <div class="font-medium">{stock.stockName}</div>
                      <div class="text-sm text-gray-500">{stock.tickerSymbol}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span>at</span>
            <input
              ref={inputRefs.price}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onFocus={() => setCurrentFocus('price')}
              placeholder="₹"
              class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <div class="flex items-center space-x-2">
            <span>Set stoploss at</span>
            <input
              ref={inputRefs.stopLoss}
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              onFocus={() => setCurrentFocus('stopLoss')}
              placeholder="₹"
              class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <div class="flex items-center space-x-2">
            <span>Target for</span>
            <input
              ref={inputRefs.target}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onFocus={() => setCurrentFocus('target')}
              placeholder="₹"
              class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
              type="number"
              min="0"
              step="0.01"
            />
          </div>


        </div>

      </div>
             
      
        <Button
            type={type}
            totalFields={totalFields}
            validFields={validFields}
            onClick={handleSubmit}
        >
            Copy
        </Button>
        
        {validFields === totalFields && (
            <Button
                type="reset"
                onClick={resetForm}
            >
                Reset
            </Button>
        )}
      </div>

  );
};

export default NewTradeCallModal;