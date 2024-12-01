import { h, Fragment } from 'preact';
import { useState, useRef, useEffect, useMemo } from 'preact/hooks';
import Button from '../atoms/Button/Button';
import { X } from 'lucide-react';


const style = `
@keyframes slideDown {
  0% { 
    transform: translateY(-20px);
    opacity: 0;
  }
  70% {
    transform: translateY(3px);
  }
  100% { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  0% { 
    transform: translateY(0);
    opacity: 1;
  }
  100% { 
    transform: translateY(-20px);
    opacity: 0;
  }
}

.search-enter {
}

.search-exit {
  animation: slideUp 0.75s ease-in forwards;
}

.modal-container {
  animation: slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
}
`;


const NewTradeCallModal = ({ isOpen, onClose }) => {
    // Keep existing state management
    const [type, setType] = useState('buy');
    const [stockSearch, setStockSearch] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [price, setPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [target, setTarget] = useState('');
    const [currentFocus, setCurrentFocus] = useState(null);
    const [showStockSearch, setShowStockSearch] = useState(false);
    const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
    //const [exactMatch , setExactMatch] = useState(false);

    const mockStocks = [
        { stockName: 'Reliance Industries Ltd', tickerSymbol: 'RELIANCE' },
        { stockName: 'Relic Technologies Ltd', tickerSymbol: 'RELICTEC' },
        { stockName: 'Reliance Infrastructure Ltd', tickerSymbol: 'RELINFRA' },
        { stockName: 'Reliable Ventures India Ltd', tickerSymbol: 'RELIABVEN' },
    ];

    const [filteredStocks, setFilteredStocks] = useState([]);

    const inputRefs = {
            type: useRef(null),
            stock: useRef(null),
            price: useRef(null),
            price2: useRef(null),
            stopLoss: useRef(null),
            target: useRef(null),
            target2: useRef(null),
            target3: useRef(null),
            copyButton: useRef(null)
    };



    const totalFields = 4;
    const validFields = [selectedStock, price, stopLoss, target].filter(Boolean).length;


    const [isSearchAnimating, setIsSearchAnimating] = useState(false);
    const [shouldRenderSearch, setShouldRenderSearch] = useState(false);

    const previousSearchRef = useRef('');

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = style;
        document.head.appendChild(styleSheet);
        return () => styleSheet.remove();
    }, []);

    // Handle search visibility animation
    useEffect(() => {
        if (showStockSearch) {
            setShouldRenderSearch(true);
            const timer = setTimeout(() => setIsSearchAnimating(true), 0);
            return () => clearTimeout(timer);
        } else {
            setIsSearchAnimating(false);
            const timer = setTimeout(() => setShouldRenderSearch(false), 150); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [showStockSearch]);

    useEffect(() => {
        if (isOpen) {
            inputRefs.type.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (stockSearch.length >= 3) {
            const filtered = mockStocks.filter(stock =>
                stock.stockName.toLowerCase().includes(stockSearch.toLowerCase()) ||
                stock.tickerSymbol.toLowerCase().includes(stockSearch.toLowerCase())
            );
            setFilteredStocks(filtered);
            setSelectedSearchIndex(-1);
        } else {
            setFilteredStocks([]);
        }
    }, [stockSearch]);
    useEffect(() => {
        switch (currentFocus) {
          case 'type':
            inputRefs.type.current?.focus();
            break;
          case 'stockSearch':
            inputRefs.stock.current?.focus();
            break;
          case 'price':
            inputRefs.price.current?.focus();
            break;
          case 'price2':
            inputRefs.price2.current?.focus();
            break;
          case 'stopLoss':
            inputRefs.stopLoss.current?.focus();
            break;
          case 'target':
            inputRefs.target.current?.focus();
            break;
          case 'target2':
            inputRefs.target2.current?.focus();
            break;
          case 'target3':
            inputRefs.target3.current?.focus();
            break;
          case 'copy':
            inputRefs.copyButton.current?.focus();
            break;
        }
      }, [currentFocus]);
    

    const matchingStock = useMemo(() => {
        if (!stockSearch) return null;
        const upperSearch = stockSearch.toUpperCase();
        return mockStocks.find(stock =>
            stock.tickerSymbol === upperSearch ||
            stock.stockName.toUpperCase() === upperSearch
        );
    }, [stockSearch, mockStocks])


    const filterStocks = useMemo(() => {
        if (stockSearch.length < 3) return [];
        const searchLower = stockSearch.toLowerCase();
        return mockStocks.filter(stock =>
            stock.stockName.toLowerCase().includes(searchLower) ||
            stock.tickerSymbol.toLowerCase().includes(searchLower)
        );
    }, [stockSearch, mockStocks]);

    const handleFocus = (e) => {
        setCurrentFocus('stockSearch')
        if (matchingStock) {
            setShowSearch(false);
        } else if (stockSearch.length >= 3) {
            setShowSearch(true);
        }
       
    };

    const handleChange = (e) => {
        const newValue = e.target.value.toUpperCase();
        setStockSearch(newValue);
        previousSearchRef.current = newValue;

        if (newValue.length >= 3) {
            setShowStockSearch(true);
            setSelectedSearchIndex(-1);
        } else {
            setShowStockSearch(false);
        }
    };

    // First, change the handleKeyDown function to:
const handleKeyDown = (e) => {
    // Prevent default behavior for arrow keys to avoid unwanted scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    // Helper function to check if a field should be hidden
    const shouldHideField = (value) => !value || value.trim() === '';

    if (showStockSearch && filteredStocks.length > 0) {
        switch (e.key) {
            case 'ArrowDown':
                setSelectedSearchIndex(prev =>
                    prev < filteredStocks.length - 1 ? prev + 1 : 0
                );
                return;
            case 'ArrowUp':
                setSelectedSearchIndex(prev =>
                    prev > 0 ? prev - 1 : filteredStocks.length - 1
                );
                return;
            case 'Enter':
                if (selectedSearchIndex >= 0) {
                    const selected = filteredStocks[selectedSearchIndex];
                    setSelectedStock(selected);
                    setStockSearch(selected.tickerSymbol);
                    setShowStockSearch(false);
                    setCurrentFocus('price');
                    return;
                }
                break;
            case 'Escape':
                setShowStockSearch(false);
                inputRefs.stock.current?.blur();
                return;
        }
    }

    switch (currentFocus) {
        case 'type':
            switch (e.key) {
                case 'Enter':
                    setType(prev => prev === 'buy' ? 'sell' : 'buy');
                    break;
                case 'ArrowRight':
                    setCurrentFocus('stockSearch');
                    break;
                case 'ArrowDown':
                    setCurrentFocus('stopLoss');
                    break;
            }
            break;

        case 'stockSearch':
            if (!showStockSearch) {
                switch (e.key) {
                    case 'ArrowLeft':
                        setCurrentFocus('type');
                        break;
                    case 'ArrowRight':
                        setCurrentFocus('price');
                        break;
                    case 'ArrowDown':
                        setCurrentFocus('stopLoss');
                        break;
                }
            }
            break;

        case 'price':
            switch (e.key) {
                case 'ArrowLeft':
                    setCurrentFocus('stockSearch');
                    break;
                case 'ArrowRight':
                    setCurrentFocus('stopLoss');
                    break;
                case 'ArrowDown':
                    setCurrentFocus('stopLoss');
                    break;
            }
            break;

        case 'stopLoss':
            switch (e.key) {
                case 'Enter':
                case 'ArrowDown':
                    setCurrentFocus('target');
                    break;
                case 'ArrowUp':
                    setCurrentFocus('price');
                    break;
                case 'ArrowLeft':
                    setCurrentFocus('price');
                    break;
                case 'ArrowRight':
                    setCurrentFocus('target');
                    break;
            }
            break;

        case 'target':
            switch (e.key) {
                case 'ArrowLeft':
                    setCurrentFocus('stopLoss');
                    break;
                case 'ArrowUp':
                    setCurrentFocus('stopLoss');
                    break;
                case 'ArrowDown':
                    if (validFields === totalFields) {
                        setCurrentFocus('copy');
                    }
                    break;
            }
            break;

        case 'copy':
            if (e.key === 'ArrowUp') {
                setCurrentFocus('target');
            }
            break;
    }
};

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


    const handleSubmit = () => {
        console.log('Form submitted with the following data:', {
            type,
            selectedStock,
            price,
            stopLoss,
            target,
        });
    };

    if (!isOpen) return null;

    return (
        <div
            class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    resetForm();
                    onClose();
                }
            }}
        >
            <div class="bg-white rounded-lg shadow-lg max-w-md m-3 max-h-[90vh] overflow-y-auto modal-container">
                <div class="px-6 pt-6">
                    {/* First row */}
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
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={() => {
                                    setTimeout(() => setShowStockSearch(false), 200);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search stocks..."
                                class={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                    }`}
                            />
                        </div>
                        <span>at</span>
                        <input
                            ref={inputRefs.price}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            onFocus={() => setCurrentFocus('price')}
                            placeholder="₹"
                            class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
                            onKeyDown={handleKeyDown}
                            type="number"
                            min="0"
                            
                        />
                    </div>
                </div>
                {/* Search Results - Show when search is active */}
                {showStockSearch ? (
                    <div class={`mt-2 origin-top ${isSearchAnimating ? 'search-enter' : 'search-exit'}`}>
                        <div class="text-sm text-gray-500 p-2 bg-gray-50 border-b">
                            Type 3 letters to filter the list...
                        </div>
                        <div class="max-h-[40vh] overflow-y-auto">
                            {filteredStocks.map((stock, index) => (
                                <div
                                    key={stock.tickerSymbol}
                                    class={`p-3 cursor-pointer border-b ${selectedSearchIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => {
                                        setSelectedStock(stock);
                                        setStockSearch(stock.tickerSymbol.toUpperCase());
                                        setShowStockSearch(false);
                                        inputRefs.price.current?.focus();
                                    }}
                                >
                                    <div class="font-medium">{stock.tickerSymbol}</div>
                                    <div class="text-sm text-gray-500">XYZ</div>
                                </div>
                            ))}
                        </div>
                        <div class="text-sm text-white bg-gray-700 p-2">
                            Press ↑ ↓ on keyboard to choose
                        </div>
                    </div>
                ) : (
                    <Fragment>
                        <div class=" px-6 mt-4 flex items-center justify-self-center space-x-2">
                            <span>Set stoploss at</span>
                            <input
                                ref={inputRefs.stopLoss}
                                value={stopLoss}
                                onChange={(e) => setStopLoss(e.target.value)}
                                onFocus={() => setCurrentFocus('stopLoss')}
                                onKeyDown={handleKeyDown}
                                placeholder="₹"
                                class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
                                type="number"
                                min="0"
                                
                            />
                        </div>

                        <div class="mt-4 px-6 pb-6 flex items-center justify-self-center space-x-2">
                            <span>Target for</span>
                            <input
                                ref={inputRefs.target}
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                onFocus={() => setCurrentFocus('target')}
                                onKeyDown={handleKeyDown}
                                placeholder="₹"
                                class={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
                                type="number"
                                min="0"
                                
                            />
                        </div>
                    </Fragment>
                )}
            </div>

            <div class="px-3 pb-3 w-full modal-container">
                <Button
                    type={type}
                    totalFields={totalFields}
                    validFields={validFields}
                    onClick={handleSubmit}
                >
                    Copy
                </Button>

                {validFields === totalFields && (
                    <div class={`mt-2`}>
                        <Button
                            type="reset"
                            onClick={resetForm}
                        >
                            Reset
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewTradeCallModal;