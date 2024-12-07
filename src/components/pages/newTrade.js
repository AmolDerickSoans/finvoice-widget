import { h, Fragment } from 'preact';
import { useState, useRef, useEffect, useMemo } from 'preact/hooks';
import Button from '../atoms/Button/Button';
import StockSearchDropdown from '../molecules/SearchDropdown/SearchDropdown'
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
    const [type, setType] = useState('Buy');
    const [stockSearch, setStockSearch] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [price, setPrice] = useState('');
    const [price2Visible, setPrice2Visible] = useState(false);
    const [price2, setPrice2] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [target, setTarget] = useState('');
    const [currentFocus, setCurrentFocus] = useState('type');
    const [showStockSearch, setShowStockSearch] = useState(false);
    const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
    const [target2Visible, setTarget2Visible] = useState(false);
    const [target3Visible, setTarget3Visible] = useState(false);
    const [target2, setTarget2] = useState('');
    const [target3, setTarget3] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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
    const validFields = [stockSearch, price, stopLoss, target].filter(Boolean).length;


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
            setCurrentFocus('type'); // Ensure currentFocus is set to 'type' when modal opens

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
            case 'Buy':
            case 'Sell':
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
        setCurrentFocus('stockSearch');
        if (!stockSearch) {
          setShowStockSearch(false);
        } else if (stockSearch.length >= 0) {
          setShowStockSearch(true);
        }
      };

    // Handle collapsing the search on blur
    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowStockSearch(false);
            setIsSearchExpanded(false);
        }, 200);
    };



    const handleChange = (e) => {
        setIsSearchExpanded(true);
        const newValue = e.target.value.toUpperCase();
        setStockSearch(newValue);
        previousSearchRef.current = newValue;

        if (newValue.length >= 0) {
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
            case 'Buy':
            case 'Sell':
            case 'type':
                switch (e.key) {
                    case 'Enter':
                        setType(prev => prev === 'Buy' ? 'Sell' : 'Buy');
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
                    case 'Enter':
                        if (!price2Visible) {
                            setPrice2Visible(true);
                            setCurrentFocus('price2');
                        }
                        break;
                    case 'ArrowLeft':
                        setCurrentFocus('stockSearch');
                        break;
                    case 'ArrowRight':
                        setCurrentFocus(price2Visible ? 'price2' : 'stopLoss');
                        break;
                    case 'ArrowDown':
                        setCurrentFocus('stopLoss');
                        break;
                }
                break;

            case 'price2':
                switch (e.key) {
                    case 'Backspace':
                        if (!price2 || price2.trim() === '') {
                            e.preventDefault();
                            setPrice2Visible(false);
                            setPrice2('');
                            setCurrentFocus('price');
                        }
                        break;
                    case 'ArrowLeft':
                        setCurrentFocus('price');
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
                    case 'Enter':
                        if (!target2Visible) {
                            setTarget2Visible(true);
                            setCurrentFocus('target2');
                        }
                        break;
                    case 'ArrowRight':
                        if (target2Visible) {
                            setCurrentFocus('target2');
                        }
                        break;
                    case 'ArrowLeft':
                        setCurrentFocus('stopLoss');
                        break;
                    case 'ArrowDown':
                        if (validFields === totalFields) {
                            setCurrentFocus('copy');
                        }
                        break;
                    case 'ArrowUp':
                        setCurrentFocus('stopLoss');
                        break;
                }
                break;

            case 'target2':
                switch (e.key) {
                    case 'Enter':
                        if (!target3Visible) {
                            setTarget3Visible(true);
                            setCurrentFocus('target3');
                        }
                        break;
                    case 'Backspace':
                        if (!target2 || target2.trim() === '') {
                            e.preventDefault();
                            setTarget2Visible(false);
                            setTarget2('');
                            setCurrentFocus('target');
                        }
                        break;
                    case 'ArrowLeft':
                        setCurrentFocus('target');
                        break;
                    case 'ArrowRight':
                        if (target3Visible) {
                            setCurrentFocus('target3');
                        }
                        break;
                    case 'ArrowUp':
                        setCurrentFocus('target');
                        break;
                    case 'ArrowDown':
                        if (target3Visible) {
                            setCurrentFocus('target3');
                        } else if (validFields === totalFields) {
                            setCurrentFocus('copy');
                        }
                        break;
                }
                break;

            case 'target3':
                switch (e.key) {
                    case 'Backspace':
                        if (!target3 || target3.trim() === '') {
                            e.preventDefault();
                            setTarget3Visible(false);
                            setTarget3('');
                            setCurrentFocus('target2');
                        }
                        break;
                    case 'ArrowLeft':
                        setCurrentFocus('target2');
                        break;
                    case 'ArrowRight':
                        if (validFields === totalFields) {
                            setCurrentFocus('copy');
                        }
                        break;
                    case 'ArrowUp':
                        setCurrentFocus('target2');
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
        setType('Buy');
        setStockSearch('');
        setSelectedStock(null);
        setPrice('');
        setStopLoss('');
        setTarget('');
        setCurrentFocus(null);
        setShowStockSearch(false);
        setSelectedSearchIndex(-1);
        setPrice2('');
        setPrice2Visible(false);
        setTarget2('');
        setTarget3('');
        setTarget2Visible(false);
        setTarget3Visible(false);
    };


    const handleSubmit = () => {
        console.log('Form submitted with the following data:', {
            type,
            stockSearch,
            selectedStock,
            price,
            price2,
            stopLoss,
            target,
            target2,
            target3,
        });

        copyToClipboard(type, stockSearch, price, stopLoss, target, price2, target2, target3);
    };

    const copyToClipboard = (type, stockSearch, price, stoploss, target, price2 = '', target2 = '', target3 = '') => {
        const textToCopy = `${type} ${stockSearch} at ₹${price}${price2 ? ' and ₹' + price2 : ''}. Set Stoploss at ₹${stoploss}. Target for ₹${target}${target2 != '' ? ', ₹' + target2 : ''}${target3 != '' ? ' and ₹' + target3 : ''}.`;
        console.log(textToCopy)
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
        ;

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
            <div class={`rounded-lg ${isSearchExpanded ? 'w-11/12 max-w-2xl' : 'max-w-md'
                } m-3 max-h-[90vh] overflow-y-auto modal-container transition-all duration-200`}>
                <div class="bg-white rounded-lg shadow-lg max-w-md m-3 max-h-[90vh] overflow-y-auto modal-container">
                    <div class="px-6 pt-6 w-full">
                        {/* First row */}
                        <div class="flex items-center space-x-2">
                            <span
                                class={`transition-all duration-100 ${isSearchExpanded
                                    ? 'w-0 p-0 m-0 overflow-hidden opacity-0'
                                    : 'w-auto p-3 opacity-100'
                                    } font-medium ${type === 'Buy' ? 'text-green-600' : 'text-red-600'
                                    } cursor-pointer`}
                                ref={inputRefs.type}
                                tabIndex={0}
                                value={type}
                                onKeyDown={handleKeyDown}
                                onClick={() => setType(prev => prev === 'Buy' ? 'Sell' : 'Buy')}
                            >
                                {type === 'Buy' ? 'Buy' : 'Sell'}
                            </span>
                            <div class={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full' : 'w-auto'
                                }`}>
                                <input
                                    ref={inputRefs.stock}
                                    value={stockSearch}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleSearchBlur}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search stocks..."
                                    class={`transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full' : 'w-48'
                                        } px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                        } overflow-hidden whitespace-nowrap text-ellipsis`}
                                />
                            </div>
                            {/* Price inputs - hidden when search expanded */}
                            <div class={`transition-all duration-300 flex items-center space-x-2 ${isSearchExpanded ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
                                }`}>
                                <span>at</span>
                                <input
                                    ref={inputRefs.price}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="₹"
                                    class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                        }`}
                                    type="number"
                                    min="0"
                                />
                                {price2Visible && (
                                    <>
                                        <span>to</span>
                                        <input
                                            ref={inputRefs.price2}
                                            value={price2}
                                            onChange={(e) => setPrice2(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="₹"
                                            class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                                }`}
                                            type="number"
                                            min="0"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Search Results - Show when search is active */}
                    {showStockSearch ? (
                        // <div class={`mt-2 origin-top ${isSearchAnimating ? 'search-enter' : 'search-exit'}`}>
                        //     <div class="text-sm text-gray-500 p-2 bg-gray-50 border-b">
                        //         Type 3 letters to filter the list...
                        //     </div>
                        //     <div class="max-h-[40vh] overflow-y-auto">
                        //         {filteredStocks.map((stock, index) => (
                        //             <div
                        //                 key={stock.tickerSymbol}
                        //                 class={`p-3 cursor-pointer border-b ${selectedSearchIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                        //                     }`}
                        //                 onClick={() => {
                        //                     setSelectedStock(stock);
                        //                     setStockSearch(stock.tickerSymbol.toUpperCase());
                        //                     setShowStockSearch(false);
                        //                     inputRefs.price.current?.focus();
                        //                 }}
                        //             >
                        //                 <div class="font-medium">{stock.tickerSymbol}</div>
                        //                 <div class="text-sm text-gray-500">XYZ</div>
                        //             </div>
                        //         ))}
                        //     </div>
                        //     <div class="text-sm text-white bg-gray-700 p-2">
                        //         Press ↑ ↓ on keyboard to choose
                        //     </div>
                        // </div>
                        <StockSearchDropdown
                        isSearchAnimating={isSearchAnimating}
                        isFocused={currentFocus === 'stockSearch'}
                        searchQuery={stockSearch}
                        filteredStocks={filteredStocks}
                        selectedSearchIndex={selectedSearchIndex}
                        showStockSearch={showStockSearch}
                        onStockSelect={(stock) => {
                          setSelectedStock(stock);
                          setStockSearch(stock.tickerSymbol.toUpperCase());
                          setShowStockSearch(false);
                            }}

                            inputRefs={inputRefs}
                        />
                    ) : (
                        <Fragment>
                            <div class=" mt-4 px-6 pb-6 flex items-center justify-center space-x-2 flex-wrap">
                                <span>Set stoploss at</span>
                                <input
                                    ref={inputRefs.stopLoss}
                                    value={stopLoss}
                                    onChange={(e) => setStopLoss(e.target.value)}
                                    onFocus={() => setCurrentFocus('stopLoss')}
                                    onKeyDown={handleKeyDown}
                                    placeholder="₹"
                                    class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
                                    type="number"
                                    min="0"

                                />
                            </div>
                            <div class="px-6 pb-6 flex items-center justify-center space-x-2 flex-wrap">
                                <span>Target for</span>
                                <input
                                    ref={inputRefs.target}
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="₹"
                                    class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                        }`}
                                    type="number"
                                    min="0"
                                />
                                {target2Visible && (
                                    <>
                                        <span>,</span>
                                        <input
                                            ref={inputRefs.target2}
                                            value={target2}
                                            onChange={(e) => setTarget2(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="₹"
                                            class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                                }`}
                                            type="number"
                                            min="0"
                                        />
                                    </>
                                )}
                                {target3Visible && (
                                    <>
                                        <span>and</span>
                                        <input
                                            ref={inputRefs.target3}
                                            value={target3}
                                            onChange={(e) => setTarget3(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="₹"
                                            class={`w-16 px-1 py-2 mt-3 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                                                }`}
                                            type="number"
                                            min="0"
                                        />
                                    </>
                                )}
                            </div>
                        </Fragment>
                    )}
                </div>

                <div class="w-full rounded-lg shadow-lg max-w-md  max-h-[90vh] overflow-y-auto modal-container px-3">
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
        </div>
    );
};

export default NewTradeCallModal;