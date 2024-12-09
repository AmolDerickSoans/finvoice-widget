import { h, Fragment } from 'preact';
import { useState, useRef, useEffect, useMemo } from 'preact/hooks';
import Button from '../atoms/Button/Button';
import { useTrade } from '../../contexts/TradeContext.js';
import StockSearchDropdown from '../molecules/SearchDropdown/SearchDropdown';
import { mockStocks } from '../../assets/data/data.js';
import { X } from 'lucide-preact';

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
    const { addTrade } = useTrade();

    //const mockStocks = mockStocks

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
    //const validFields = [stockSearch, price, stopLoss, target].filter(Boolean).length;
    const validFields = []


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
                if (selectedStock) {
                    setStockSearch(selectedStock.tickerSymbol);
                }
                break;
            case 'price':
                inputRefs.price.current?.focus();
                break;
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

    // const handleFocus = (e) => {
    //     setCurrentFocus('stockSearch');
    //     if (!stockSearch) {
    //       setShowStockSearch(false);
    //     } else if (stockSearch.length >= 0) {
    //       setShowStockSearch(true);
    //     }
    //   };

      //new
      const TRANSITIONS = {
        type: {
          ArrowRight: 'stockSearch',
          ArrowDown: 'stopLoss',
          Enter: 'toggleType'
        },
        stockSearch: {
          ArrowLeft: 'type',
          ArrowRight: 'price',
          ArrowDown: 'stopLoss',
          Enter: 'selectStock'
        },
        price: {
          ArrowLeft: 'stockSearch',
          ArrowRight: 'price2',
          ArrowDown: 'stopLoss',
          Enter: 'showPrice2'
        },
        price2: {
          ArrowLeft: 'price',
          ArrowRight: 'stopLoss',
          ArrowDown: 'stopLoss',
          Backspace: 'hidePrice2'
        },
        stopLoss: {
          ArrowUp: 'price',
          ArrowLeft: 'price',
          ArrowRight: 'target',
          ArrowDown: 'target',
          Enter: 'target'
        },
        target: {
          ArrowUp: 'stopLoss',
          ArrowLeft: 'stopLoss',
          ArrowRight: 'target2',
          ArrowDown: 'copy',
          Enter: 'showTarget2'
        },
        target2: {
          ArrowUp: 'target',
          ArrowLeft: 'target',
          ArrowRight: 'target3',
          ArrowDown: 'target3',
          Enter: 'showTarget3',
          Backspace: 'hideTarget2'
        },
        target3: {
          ArrowUp: 'target2',
          ArrowLeft: 'target2',
          ArrowRight: 'copy',
          ArrowDown: 'copy',
          Backspace: 'hideTarget3'
        },
        copy: {
          ArrowUp: 'target'
        }
      };
      const handleFieldChange = (field, value) => {
        e.preventDefault()
        switch (field) {
          case 'stock':
            setStockSearch(value.toUpperCase());
            if (value.length >= 3) {
              const filtered = mockStocks.filter(stock =>
                stock.stockName.toLowerCase().includes(value.toLowerCase()) ||
                stock.tickerSymbol.toLowerCase().includes(value.toLowerCase())
              );
              setFilteredStocks(filtered);
              setSelectedSearchIndex(-1);
              setShowStockSearch(true);
            } else {
              setFilteredStocks([]);
              setShowStockSearch(false);
            }
            break;
          case 'price':
            setPrice(value);
            break;
          case 'price2':
            setPrice2(value);
            break;
          case 'stopLoss':
            setStopLoss(value);
            break;
          case 'target':
            setTarget(value);
            break;
          case 'target2':
            setTarget2(value);
            break;
          case 'target3':
            setTarget3(value);
            break;
        }
      };
      useEffect(() => {
        switch (currentFocus) {
          case 'type':
            inputRefs.type.current?.focus();
            break;
          case 'stockSearch':
            inputRefs.stock.current?.focus();
            if (stockSearch.length > 0) {
              setShowStockSearch(true);
            }
            break;
          case 'price':
            inputRefs.price.current?.focus();
            break;
          case 'price2':
            if (price2Visible) {
              inputRefs.price2.current?.focus();
            }
            break;
          case 'stopLoss':
            inputRefs.stopLoss.current?.focus();
            break;
          case 'target':
            inputRefs.target.current?.focus();
            break;
          case 'target2':
            if (target2Visible) {
              inputRefs.target2.current?.focus();
            }
            break;
          case 'target3':
            if (target3Visible) {
              inputRefs.target3.current?.focus();
            }
            break;
          case 'copy':
            inputRefs.copyButton.current?.focus();
            break;
        }
      }, [currentFocus, price2Visible, target2Visible, target3Visible]);
    
      useEffect(() => {
        if (showStockSearch) {
          setIsSearchAnimating(true);
        } else {
          setIsSearchAnimating(false);
        }
      }, [showStockSearch]);

      const handleKeyDown = (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
    
        // Handle search dropdown navigation
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
                handleStockSelect(selected);
                return;
              }
              break;
            case 'Escape':
              setShowStockSearch(false);
              setIsSearchExpanded(false);
              break;
            case 'ArrowLeft':
            case 'ArrowRight':
              if (isValidStock(stockSearch)) {
                setShowStockSearch(false);
                setIsSearchExpanded(false);
                const nextFocus = e.key === 'ArrowRight' ? 'price' : 'type';
                setCurrentFocus(nextFocus);
              }
              break;
          }
          return;
        }

            // Handle regular navigation
    const transitions = TRANSITIONS[currentFocus];
    if (!transitions) return;

    const nextAction = transitions[e.key];
    if (!nextAction) return;

    switch (nextAction) {
      case 'toggleType':
        setType(prev => prev === 'Buy' ? 'Sell' : 'Buy');
        break;
      case 'selectStock':
        if (isValidStock(stockSearch)) {
          setCurrentFocus('price');
        }
        break;
      case 'showPrice2':
        setPrice2Visible(true);
        setCurrentFocus('price2');
        break;
      case 'hidePrice2':
        if (!price2) {
          e.preventDefault();
          setPrice2Visible(false);
          setPrice2('');
          setCurrentFocus('price');
        }
        break;
      case 'showTarget2':
        setTarget2Visible(true);
        setCurrentFocus('target2');
        break;
      case 'showTarget3':
        setTarget3Visible(true);
        setCurrentFocus('target3');
        break;
      case 'hideTarget2':
        if (!target2) {
          e.preventDefault();
          setTarget2Visible(false);
          setTarget2('');
          setCurrentFocus('target');
        }
        break;
      case 'hideTarget3':
        if (!target3) {
          e.preventDefault();
          setTarget3Visible(false);
          setTarget3('');
          setCurrentFocus('target2');
        }
        break;
      default:
        setCurrentFocus(nextAction);
    }
    }
      // Focus Handlers
  const handleFocus = (field) => {
    setCurrentFocus(field);
    if (field === 'stockSearch' && stockSearch.length > 0) {
      setShowStockSearch(true);
      setIsSearchExpanded(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowStockSearch(false);
      setIsSearchExpanded(false);
    }, 200);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setStockSearch(stock.tickerSymbol);
    setShowStockSearch(false);
    setIsSearchExpanded(false);
    setCurrentFocus('price');
  };
    


      //end new
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
    // const handleKeyDown = (e) => {
    //     // Prevent default behavior for arrow keys to avoid unwanted scrolling
    //     if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    //         e.preventDefault();
    //     }

    //     // Helper function to check if a field should be hidden
    //     const shouldHideField = (value) => !value || value.trim() === '';

    //     if (showStockSearch && filteredStocks.length > 0) {
    //         switch (e.key) {
    //             case 'ArrowDown':
    //                 setSelectedSearchIndex(prev =>
    //                     prev < filteredStocks.length - 1 ? prev + 1 : 0
    //                 );
    //                 return;
    //             case 'ArrowUp':
    //                 setSelectedSearchIndex(prev =>
    //                     prev > 0 ? prev - 1 : filteredStocks.length - 1
    //                 );
    //                 return;
    //             case 'Enter':
    //                 if (selectedSearchIndex >= 0) {
    //                     const selected = filteredStocks[selectedSearchIndex];
    //                     setSelectedStock(selected);
    //                     setStockSearch(selected.tickerSymbol);
    //                     setShowStockSearch(false);
    //                     setCurrentFocus('price');
    //                     return;
    //                 }
    //                 break;
    //             case 'Escape':
    //                 setShowStockSearch(false);
    //                 inputRefs.stock.current?.blur();
    //                 return;
    //         }
    //     }

    //     switch (currentFocus) {
    //         case 'Buy':
    //         case 'Sell':
    //         case 'type':
    //             switch (e.key) {
    //                 case 'Enter':
    //                     setType(prev => prev === 'Buy' ? 'Sell' : 'Buy');
    //                     break;
    //                 case 'ArrowRight':
    //                     setCurrentFocus('stockSearch');
    //                     break;
    //                 case 'ArrowDown':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //             }
    //             break;

    //         case 'stockSearch':
    //             if (!showStockSearch) {
    //                 switch (e.key) {
    //                     case 'ArrowLeft':
    //                         setCurrentFocus('type');
    //                         break;
    //                     case 'ArrowRight':
    //                         setCurrentFocus('price');
    //                         break;
    //                     case 'ArrowDown':
    //                         setCurrentFocus('stopLoss');
    //                         break;
    //                 }
    //             }
    //             break;

    //         case 'price':
    //             switch (e.key) {
    //                 case 'Enter':
    //                     if (!price2Visible) {
    //                         setPrice2Visible(true);
    //                         setCurrentFocus('price2');
    //                     }
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('stockSearch');
    //                     break;
    //                 case 'ArrowRight':
    //                     setCurrentFocus(price2Visible ? 'price2' : 'stopLoss');
    //                     break;
    //                 case 'ArrowDown':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //             }
    //             break;

    //         case 'price2':
    //             switch (e.key) {
    //                 case 'Backspace':
    //                     if (!price2 || price2.trim() === '') {
    //                         e.preventDefault();
    //                         setPrice2Visible(false);
    //                         setPrice2('');
    //                         setCurrentFocus('price');
    //                     }
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('price');
    //                     break;
    //                 case 'ArrowRight':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //                 case 'ArrowDown':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //             }
    //             break;

    //         case 'stopLoss':
    //             switch (e.key) {
    //                 case 'Enter':
    //                 case 'ArrowDown':
    //                     setCurrentFocus('target');
    //                     break;
    //                 case 'ArrowUp':
    //                     setCurrentFocus('price');
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('price');
    //                     break;
    //                 case 'ArrowRight':
    //                     setCurrentFocus('target');
    //                     break;
    //             }
    //             break;

    //         case 'target':
    //             switch (e.key) {
    //                 case 'Enter':
    //                     if (!target2Visible) {
    //                         setTarget2Visible(true);
    //                         setCurrentFocus('target2');
    //                     }
    //                     break;
    //                 case 'ArrowRight':
    //                     if (target2Visible) {
    //                         setCurrentFocus('target2');
    //                     }
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //                 case 'ArrowDown':
    //                     if (validFields === totalFields) {
    //                         setCurrentFocus('copy');
    //                     }
    //                     break;
    //                 case 'ArrowUp':
    //                     setCurrentFocus('stopLoss');
    //                     break;
    //             }
    //             break;

    //         case 'target2':
    //             switch (e.key) {
    //                 case 'Enter':
    //                     if (!target3Visible) {
    //                         setTarget3Visible(true);
    //                         setCurrentFocus('target3');
    //                     }
    //                     break;
    //                 case 'Backspace':
    //                     if (!target2 || target2.trim() === '') {
    //                         e.preventDefault();
    //                         setTarget2Visible(false);
    //                         setTarget2('');
    //                         setCurrentFocus('target');
    //                     }
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('target');
    //                     break;
    //                 case 'ArrowRight':
    //                     if (target3Visible) {
    //                         setCurrentFocus('target3');
    //                     }
    //                     break;
    //                 case 'ArrowUp':
    //                     setCurrentFocus('target');
    //                     break;
    //                 case 'ArrowDown':
    //                     if (target3Visible) {
    //                         setCurrentFocus('target3');
    //                     } else if (validFields === totalFields) {
    //                         setCurrentFocus('copy');
    //                     }
    //                     break;
    //             }
    //             break;

    //         case 'target3':
    //             switch (e.key) {
    //                 case 'Backspace':
    //                     if (!target3 || target3.trim() === '') {
    //                         e.preventDefault();
    //                         setTarget3Visible(false);
    //                         setTarget3('');
    //                         setCurrentFocus('target2');
    //                     }
    //                     break;
    //                 case 'ArrowLeft':
    //                     setCurrentFocus('target2');
    //                     break;
    //                 case 'ArrowRight':
    //                     if (validFields === totalFields) {
    //                         setCurrentFocus('copy');
    //                     }
    //                     break;
    //                 case 'ArrowUp':
    //                     setCurrentFocus('target2');
    //                     break;
    //                 case 'ArrowDown':
    //                     if (validFields === totalFields) {
    //                         setCurrentFocus('copy');
    //                     }
    //                     break;
    //             }
    //             break;

    //         case 'copy':
    //             if (e.key === 'ArrowUp') {
    //                 setCurrentFocus('target');
    //             }
    //             break;
    //     }
    // };

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
        // Prepare trade data object
        const tradeData = {
            type,
            stockName: selectedStock?.stockName || stockSearch,
            tickerSymbol: selectedStock?.tickerSymbol || stockSearch,
            price: {
                main: parseFloat(price),
                secondary: price2 ? parseFloat(price2) : null
            },
            stopLoss: parseFloat(stopLoss),
            updatedAt: new Date().toISOString(),
            targets: [
                parseFloat(target),
                target2 ? parseFloat(target2) : null,
                target3 ? parseFloat(target3) : null
            ].filter(Boolean)
        };

        // Add trade using context
        addTrade(tradeData);

        // Copy to clipboard
        copyToClipboard(type, stockSearch, price, stopLoss, target, price2, target2, target3);
        
        // Reset form and close modal
       // resetForm();
       // onClose();
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
                        <div class="flex items-center justify-center flex-wrap gap-2">
                            <span
                                class={`transition-all duration-100 ${isSearchExpanded
                                    ? 'w-0 p-0 m-0 overflow-hidden invisible h-0 opacity-0'
                                    : 'w-auto p-3 opacity-100 focus:ring-2 rounded-lg'
                                    } font-medium ${type === 'Buy' ? ' focus:ring-green-600 text-green-600' : ' focus:ring-red-600 text-red-600'
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
                                    onChange={(e) => handleFieldChange('stock', e.target.value)}
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
                            <div class={`transition-all duration-300   justify-center flex-wrap gap-2 flex items-center ${isSearchExpanded ? 'w-0 overflow-hidden invisible h-0 opacity-0' : 'w-auto opacity-100 visible'
                                }`}>
                                <span>at</span>
                                <input
                                    ref={inputRefs.price}
                                    value={price}
                                    onChange={((e) => handleFieldChange('stock', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="₹"
                                    class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2  ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
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
                            <div class="px-6 pb-6">
              <div class="flex items-center justify-center flex-wrap gap-2">
                <span class="whitespace-nowrap">Target for</span>
                <input
                  ref={inputRefs.target}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="₹"
                  class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                  }`}
                  type="number"
                  min="0"
                />
                {target2Visible && (
                  <div class="flex items-center gap-2">
                    <span class="whitespace-nowrap">,</span>
                    <input
                      ref={inputRefs.target2}
                      value={target2}
                      onChange={(e) => setTarget2(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="₹"
                      class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                      }`}
                      type="number"
                      min="0"
                    />
                  </div>
                )}
                {target3Visible && (
                  <div class="flex items-center gap-2">
                    <span class="whitespace-nowrap">and</span>
                    <input
                      ref={inputRefs.target3}
                      value={target3}
                      onChange={(e) => setTarget3(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="₹"
                      class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2  ${
                        type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                      }`}
                      type="number"
                      min="0"
                    />
                  </div>
                )}
              </div>
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
