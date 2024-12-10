import { h, Fragment } from 'preact';
import { useState, useRef, useEffect, useMemo, useReducer } from 'preact/hooks';
import Button from '../atoms/Button/Button';
import StockSearchDropdown from '../molecules/SearchDropdown/SearchDropdown'
import { useTrade } from '../../contexts/TradeContext.js';
import { mockStocks } from '../../assets/data/data.js';
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

// Navigation map factory for dynamic field navigation
const createNavigationMap = ({
  price2Visible,
  target2Visible,
  target3Visible,
  handleFieldExpansion,
  handleFieldCollapse,
  validatePrices,
  isSearchMode
}) => ({
  type: {
    right: 'stockSearch',
    down: 'stopLoss',
    ariaLabel: 'Trade type selector',
  },
  stockSearch: {
    left: 'type',
    right: 'price',
    down: 'stopLoss',
    ariaLabel: 'Stock search',
  },
  price: {
    left: 'stockSearch',
    right: price2Visible ? 'price2' : 'stopLoss',
    down: 'stopLoss',
    enter: () => handleFieldExpansion('price2'),
    ariaLabel: 'Price input',
  },
  price2: price2Visible
    ? {
        left: 'price',
        right: 'stopLoss',
        backspace: (value) => handleFieldCollapse('price2', value),
        ariaLabel: 'Secondary price input',
      }
    : null,
  stopLoss: {
    left: price2Visible ? 'price2' : 'price',
    right: 'target',
    down: 'target',
    up: price2Visible ? 'price2' : 'price',
    enter: 'target',
    ariaLabel: 'Stop loss input',
  },
  target: {
    left: 'stopLoss',
    right: target2Visible ? 'target2' : 'type',
    up: 'stopLoss',
    
    
    enter: () => handleFieldExpansion('target2'),
    ariaLabel: 'Target price input'
  },
  target2: target2Visible ? {
    left: 'target',
    right: target3Visible ? 'target3' : 'type',
    up: 'target',
    enter: () => handleFieldExpansion('target3'),
    backspace: (value) => handleFieldCollapse('target2', value),
    ariaLabel: 'Second target input'
  } : null,
  target3: target3Visible ? {
    left: 'target2',
    up: 'target2',
    backspace: (value) => handleFieldCollapse('target3', value),
    ariaLabel: 'Third target input'
  } : null,
  copy: {
    left: target3Visible ? 'target3' : target2Visible ? 'target2' : 'target',
    up: target3Visible ? 'target3' : target2Visible ? 'target2' : 'target',
    ariaLabel: 'Copy trade details'
  }
});

const NewTradeCallModal = ({ isOpen, onClose }) => {
  // Trade context
  const { addTrade } = useTrade();
  // Form data state
  const [type, setType] = useState('Buy');
  const [formData, setFormData] = useState({
    stock: '',
    stockName: '',
    price: '',
    price2: '',
    stopLoss: '',
    target: '',
    target2: '',
    target3: ''
  });

  // UI state
  const [currentFocus, setCurrentFocus] = useState('type');
  const [expandedFields, setExpandedFields] = useState({
    price2: false,
    target2: false,
    target3: false
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);

  // Refs for focus management
  const inputRefs = {
    type: useRef(null),
    stockSearch: useRef(null),
    price: useRef(null),
    price2: useRef(null),
    stopLoss: useRef(null),
    target: useRef(null),
    target2: useRef(null),
    target3: useRef(null),
    copy: useRef(null)
  };

  useEffect(() => {
    if (!isOpen) return; // Ensure focus management only applies when modal is open
    const ref = inputRefs[currentFocus]?.current;
    if (ref) {
      ref.focus();
    }
  }, [currentFocus, isOpen]);

  // Add validation state
  const [validFields, setValidFields] = useState({
    stock: false,
    price: false,
    stopLoss: false,
    target: false
  });

  // Helper function to check if a field is valid
  const validateField = (field, value) => {
    switch (field) {
      case 'stock':
        return value.length >= 2;
      case 'price':
        return parseFloat(value) > 0;
      case 'stopLoss':
        return parseFloat(value) > 0;
      case 'target':
        return parseFloat(value) > 0;
      default:
        return false;
    }
  };

  // Update the handleInputChange function
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidFields(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
    
    // Handle collapsible fields
    if ((field === 'price2' || field.startsWith('target')) && !value) {
      const fieldName = field.replace(/\d+$/, '');
      handleFieldCollapse(field, value);
      setCurrentFocus(fieldName);
    }
  };
  

  const handleFieldExpansion = (field) => {
    console.log('Expanding field:', field); // Add debugging
    if (field === 'price2' && !validatePrices()) {
      return; // Don't expand if validation fails
    }
    
    setExpandedFields(prev => ({ ...prev, [field]: true }));
    setCurrentFocus(field);
  };
  
  const handleFieldCollapse = (field, value) => {
    console.log('Collapsing field:', field, 'value:', value); // Add debugging
    if (!value) {
      setExpandedFields(prev => ({ ...prev, [field]: false }));
      setFormData(prev => ({ ...prev, [field]: '' }));
      
      const previousFields = {
        price2: 'price',
        target2: 'target',
        target3: 'target2'
      };
      setCurrentFocus(previousFields[field]);
    }}

  // Update handleStockSelect to set stock validation
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setFormData(prev => ({
      ...prev,
      stock: stock.tickerSymbol,
      stockName: stock.stockName
    }));
    setValidFields(prev => ({
      ...prev,
      stock: true
    }));
    setShowStockSearch(false);
    setIsSearchExpanded(false);
    setCurrentFocus('price');
  };

  // Calculate total valid fields
  const totalValidFields = useMemo(() => 
    Object.values(validFields).filter(Boolean).length,
    [validFields]
  );

  // Update resetForm to reset all state
  const resetForm = () => {
    setType('Buy');
    setFormData({
      stock: '',
      stockName: '',
      price: '',
      price2: '',
      stopLoss: '',
      target: '',
      target2: '',
      target3: ''
    });
    setSelectedStock(null);
    setCurrentFocus('type');
    setShowStockSearch(false);
    setSelectedSearchIndex(-1);
    setExpandedFields({
      price2: false,
      target2: false,
      target3: false
    });
    setIsSearchExpanded(false);
    setIsSearchMode(false);
    setFilteredStocks([]);
    setValidFields({
      stock: false,
      price: false,
      stopLoss: false,
      target: false
    });
  };

  // Add style to document
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = style;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    console.log('Focus changed to:', currentFocus); // Add debugging
    const ref = inputRefs[currentFocus];
    if (ref?.current) {
      ref.current.focus();
      // For type element, we need special handling
      if (currentFocus === 'type') {
        ref.current.classList.add('ring-2');
      }
    }
  }, [currentFocus]);

  // Validation functions
  const validatePrices = () => {
    if (!expandedFields.price2) return true;
    const price1 = parseFloat(formData.price);
    const price2 = parseFloat(formData.price2);
    return !price2 || price2 > price1;
  };

  // Add new state near other state declarations
  const [isSearchInteracting, setIsSearchInteracting] = useState(false);
    const handleSearchFocus = () => {
      setIsSearchAnimating(true);
      setIsSearchExpanded(true);
      //setShowDropdown
      setShowStockSearch(true)
    };

  // Replace existing handleSearchBlur
  const handleSearchBlur = () => {
    // Log the blur event and current interaction state
    setIsSearchAnimating(false);
    console.log('Search blur:', {
      isSearchInteracting,
      hasValue: formData.stock.length > 0,
      showingResults: showStockSearch
    });

    // Use a timeout to allow click events on dropdown to complete
    setTimeout(() => {
      // Only collapse search if we're not interacting with dropdown
      if (!isSearchInteracting) {
        // If we have a valid stock selected, keep the compressed view
        // Otherwise, reset to default state
        if (validFields.stock) {
          setIsSearchExpanded(false);
          setShowStockSearch(false);
        } else {
          // Clear invalid search on blur
          setFormData(prev => ({ ...prev, stock: '' }));
          setIsSearchExpanded(false);
          setShowStockSearch(false);
          setFilteredStocks([]);
        }
      }
    }, 150); // Reduced timeout for better responsiveness
  };

  // Add new handlers for dropdown interaction
  const handleSearchMouseEnter = () => {
    setIsSearchInteracting(true);
  };

  const handleSearchMouseLeave = () => {
    setIsSearchInteracting(false);
  };

  const getNextField = (currentField, direction) => {
    const nav = navigationMap[currentField];
    if (!nav) return currentField;
  
    let nextField = nav[direction];
    if (typeof nextField === 'function') {
      nextField = nextField();
    }
  
    // Validate visibility and existence
    if (!nextField || !navigationMap[nextField]) return currentField;
  
    return nextField;
  };

  // Create navigation map
  const navigationMap = useMemo(() => createNavigationMap({
    price2Visible: expandedFields.price2,
    target2Visible: expandedFields.target2,
    target3Visible: expandedFields.target3,
    handleFieldExpansion,
    handleFieldCollapse,
    validatePrices,
    isSearchMode
  }), [expandedFields, formData, isSearchMode]);

const handleKeyDown = (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    e.stopPropagation(); 
    const direction = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }[e.key];
    const nextField = getNextField(currentFocus, direction);
    if (nextField && nextField !== currentFocus) {
      setCurrentFocus(nextField);
    }
  }
  else if (e.type === 'click') { 
    const clickedField = Object.keys(inputRefs).find(key => inputRefs[key].current === e.target);
    if (clickedField) {
        setCurrentFocus(clickedField);
    }
  }
};

const handleInputKeyDown = (e, field) => {
 // e.stopPropagation(); // Prevent this from triggering parent handlers
  // if (e.key === 'Enter') {
  //   if(field == 'type'){
  //     setType(prev => prev === 'Buy' ? 'Sell' : 'Buy')
  //   }
  //   else{
  //     handleFieldExpansion(field);
  //   }
  // }
};
  // Copy to clipboard function
  const handleCopy = () => {
    const { stock, price, price2, stopLoss, target, target2, target3 } = formData;
    const text = `${type} ${stock} at ₹${price}${price2 ? ' and ₹' + price2 : ''}. ` +
                `Set Stoploss at ₹${stopLoss}. Target for ₹${target}` +
                `${target2 ? ', ₹' + target2 : ''}${target3 ? ' and ₹' + target3 : ''}.`;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        addTrade({
          type,
          stockName: formData.stockName,
          tickerSymbol: formData.stock,
          price: {
            main: parseFloat(price),
            secondary: price2 ? parseFloat(price2) : null
          },
          stopLoss: parseFloat(stopLoss),
          targets: [target, target2, target3].filter(Boolean).map(t => parseFloat(t))
        });
      })
      .catch(console.error);
  };

  // Add filtering effect after other useEffects
useEffect(() => {
  if (formData.stock.length > 0) {
    const filtered = mockStocks.filter(stock =>
      stock.stockName.toLowerCase().includes(formData.stock.toLowerCase()) ||
      stock.tickerSymbol.toLowerCase().includes(formData.stock.toLowerCase())
    );
    setFilteredStocks(filtered);
   // setShowDropdown(true);
   setShowStockSearch(true)
   // setSearchIndex(-1); // Reset selection on new search
  } else {
    setFilteredStocks(mockStocks.slice(0, 10)); // Show first 10 stocks when empty
    //setShowDropdown(true);
    setShowStockSearch(true)
  }
}, [formData.stock]);

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
                } m-3 max-h-[90vh] overflow-y-auto modal-container transition-all duration-200`}
                onKeyDown={handleKeyDown}
                onClick={handleKeyDown}
                onKeyUp={() => document.removeEventListener('keydown', handleKeyDown)}
                >
                <div class="bg-white rounded-lg shadow-lg max-w-md m-3 max-h-[90vh] overflow-y-auto modal-container">
                    <div class="px-6 pt-6 w-full">
                        {/* First row */}
                        <div class="flex items-center justify-center flex-wrap gap-2">
                            <span
                                class={`transition-all duration-100 ${isSearchExpanded
                                    ? 'w-0 p-0 m-0 overflow-hidden opacity-0'
                                    : 'w-auto p-3 opacity-100 focus:ring-2 rounded-lg'
                                    } font-medium ${type === 'Buy' ? ' focus:ring-green-600 text-green-600' : ' focus:ring-red-600 text-red-600'
                                    } cursor-pointer`}
                                ref={inputRefs.type}
                                tabIndex={0}
                                value={type}
                               // onKeyDown={handleKeyDown}
                               onKeyDown={handleInputKeyDown('type')}
                                onClick={() => setType(prev => prev === 'Buy' ? 'Sell' : 'Buy')}
                            >
                                {type === 'Buy' ? 'Buy' : 'Sell'}
                            </span>
                            <div class={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
                                <input
                                    ref={inputRefs.stockSearch}
                                    value={formData.stock}
                                    onChange={(e) => handleInputChange('stock', e.target.value)}
                                    onFocus={handleSearchFocus}
                                    onBlur={handleSearchBlur}
                                  //  onKeyDown={handleKeyDown}
                                    placeholder="Search stocks..."
                                    class={`transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full' : 'w-48'} px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'} overflow-hidden whitespace-nowrap text-ellipsis`}
                                />
                            </div>
                            {/* Price inputs - hidden when search expanded */}
                            <div class={`transition-all duration-300 justify-center flex-wrap gap-2 flex items-center ${isSearchExpanded ? 'w-0 overflow-hidden invisible h-0 opacity-0' : 'w-auto opacity-100 visible'}`}>
                                <span>at</span>
                                <input
                                    ref={inputRefs.price}
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                //    onKeyDown={handleKeyDown}
                                    placeholder="₹"
                                    class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
                                    type="number"
                                    min="0"
                                />
                                {expandedFields.price2 && (
                                    <>
                                        <span>to</span>
                                        <input
                                            ref={inputRefs.price2}
                                            value={formData.price2}
                                            onChange={(e) => handleInputChange('price2', e.target.value)}
                                 //           onKeyDown={handleKeyDown}
                                            placeholder="₹"
                                            class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
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
                            searchQuery={formData.stock}
                            filteredStocks={filteredStocks}
                            selectedSearchIndex={selectedSearchIndex}
                            showStockSearch={showStockSearch}
                            onStockSelect={handleStockSelect}
                            onMouseEnter={handleSearchMouseEnter}
                            onMouseLeave={handleSearchMouseLeave}
                            inputRefs={inputRefs}
                        />
                    ) : (
                      <Fragment>
                      <div class="mt-4 px-6 pb-6 flex items-center justify-center space-x-2 flex-wrap">
                          <span>Set stoploss at</span>
                          <input
                              ref={inputRefs.stopLoss}
                              value={formData.stopLoss}
                              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                       //       onKeyDown={handleKeyDown}
                              placeholder="₹"
                              class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                              }`}
                              type="number"
                              min="0"
                          />
                      </div>
                      <div class="px-6 pb-6">
        <div class="flex items-center justify-center flex-wrap gap-2">
          <span class="whitespace-nowrap">Target for</span>
          <input
            ref={inputRefs.target}
            value={formData.target}
            onChange={(e) => handleInputChange('target', e.target.value)}
          //  onKeyDown={handleKeyDown}
            placeholder="₹"
            class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
            }`}
            type="number"
            min="0"
          />
          {expandedFields.target2 && (
            <div class="flex items-center gap-2">
              <span class="whitespace-nowrap">,</span>
              <input
                ref={inputRefs.target2}
                value={formData.target2}
                onChange={(e) => handleInputChange('target2', e.target.value)}
             //   onKeyDown={handleKeyDown}
                placeholder="₹"
                class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  type === 'Sell' ? 'focus:ring-red-500' : 'focus:ring-green-500'
                }`}
                type="number"
                min="0"
              />
            </div>
          )}
          {expandedFields.target3 && (
            <div class="flex items-center gap-2">
              <span class="whitespace-nowrap">and</span>
              <input
                ref={inputRefs.target3}
                value={formData.target3}
                onChange={(e) => handleInputChange('target3', e.target.value)}
            //    onKeyDown={handleKeyDown}
                placeholder="₹"
                class={`w-16 px-1 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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

                <div class="w-full rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-y-auto modal-container px-3">
                    <Button
                        type={type}
                        totalFields={4}
                        validFields={totalValidFields}
                        onClick={handleCopy}
                    >
                        Copy
                    </Button>

                    {totalValidFields === 4 && (
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

document.addEventListener('keydown', (e) => {
  console.log('Event bubbling detected at:', e.target, 'with key:', e.key);
});