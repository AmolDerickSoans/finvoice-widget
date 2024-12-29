import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Send, Eye, AlertCircle, X } from 'lucide-preact';
import { useTrade } from '../../contexts/TradeContext';
import Button from '../atoms/Button/Button';
import TradeInput from '../atoms/TradeInput/TradeInput';
import TradeTypeToggle from '../molecules/TradeTypeToggle';
import PreviewModal from '../organisms/PreviewModal';
import { route } from 'preact-router';
import StockSearch from '../molecules/StockSearch';
import useLLM from '../../hooks/useLLM';


const NewTradePage = () => {
  // Context
  const { addTrade } = useTrade();

  // Form state management
  const [formData, setFormData] = useState({
    stock: '',
    stockName: '',
    price: '',
    price2: '',
    stopLoss: '',
    target: '',
    target2: '',
    target3: '',
    timePeriod: 'Intraday',
    notes: ''
  });

  // UI state
  const [type, setType] = useState('buy');
  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  //logic state
  const [wordCount, setWordCount] = useState(0);


  const { 
    showPreview, 
    setShowPreview,
    previewLoading,
    submitLoading, 
    llmResponse,
    handlePreview,
    handleSubmit 
  } = useLLM();

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'stock':
        return !value ? 'Stock is required' : '';

      case 'price':
        if (!value) return 'Entry price is required';
        if (value.includes('-')) {
          const [price1, price2] = value.split('-').map(v => parseFloat(v.trim()));
          if (isNaN(price1) || isNaN(price2)) return 'Invalid price values';
          if (price2 <= price1) return 'Second price must be greater than first price';
        } else if (isNaN(parseFloat(value))) {
          return 'Invalid price value';
        }
        return '';

      case 'stopLoss':
        if (!value) return 'Stop loss is required';
        if (isNaN(parseFloat(value))) return 'Invalid stop loss value';
        return '';

      case 'target':
        if (!value) return 'Target is required';
        if (value.includes('-')) {
          const targets = value.split('-').map(v => parseFloat(v.trim()));
          if (targets.some(isNaN)) return 'Invalid target values';
          for (let i = 1; i < targets.length; i++) {
            if (targets[i] <= targets[i - 1]) return 'Each target must be greater than the previous one';
          }
        } else if (isNaN(parseFloat(value))) {
          return 'Invalid target value';
        }
        return '';

      case 'notes':
        const words = value.trim().split(/\s+/);
        const newWordCount = value.trim() === '' ? 0 : words.length;
        setWordCount(newWordCount);
        if (newWordCount > 550) {
          return 'RA Notes cannot exceed 550 words';
        }
        return '';


      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Log all validation errors
    console.log('Validation Errors:', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handlePreviewClick = async () => {
    if (!validateForm()) return;
    const tradeData = setTradeData();
    await handlePreview(tradeData);
  };


  const handleSubmitClick = async () => {
    if (!validateForm()) return;
    const tradeData = setTradeData();
    await handleSubmit(tradeData, () => {
      addTrade(tradeData);
      route('/');
    });
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'stock') {
        setSearchQuery(value); // Update search query immediately
        if (value.length >= 2) { // Ensure search only happens if length is 2 or more
          // Trigger search logic here if needed
        } else {
          setSearchResults([]); // Clear results if input is less than 2 characters
          setShowSearchResults(false); // Hide dropdown
        }
        // DO NOT VALIDATE HERE
      } else {
        // Validate other fields immediately
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
      }

      return updated;
    });
  };

  // Search stock handling


  const handleStockSelect = (stock) => {
    setFormData(prev => ({
      ...prev,
      stock: stock.ticker,
      stockName: stock.name,
      price: '',
      stopLoss: '',
      target: ''
    }));
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery(stock.name);
    const error = validateField('stock', stock.ticker);
    setErrors(prev => ({ ...prev, stock: error }));
  };

  // Function to set trade data
  const setTradeData = () => {
    return {
      type: type.toUpperCase(),
      tickerSymbol: formData.stock,
      stockName: formData.stockName,
      price: { main: formData.price },
      stopLoss: formData.stopLoss,
      targets: [formData.target],
      timePeriod: formData.timePeriod,
      notes: formData.notes // Use llmResponse for notes
    };
  };



  // Clipboard copy function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a success message or notification
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        // Optional: Show an error message
        alert('Failed to copy to clipboard.');
      });
  };

  // Form submission


  // Calculate form completion for button state
  const requiredFields = ['stock', 'price', 'stopLoss', 'target'];
  const validFields = requiredFields.filter(field =>
    formData[field] && !errors[field]
  ).length;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header class="bg-white border-b sticky top-0 z-10 shadow">
        <div class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-900">New Trade Call</h1>
          <button
            class="text-gray-600 hover:text-gray-900"
            onClick={() => route('/')}
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-3xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 space-y-6">
            {/* Trade Type Toggle */}
            <TradeTypeToggle
              value={type}
              onChange={setType}
            />

            {/* Stock Selection */}
            <div class="relative">
              <label class="text-sm font-medium">
                Stock <span class="text-red-500">*</span>
              </label>
              <StockSearch
                onSelect={(stock) => handleStockSelect(stock)}
              />
            </div>

            {/* Price Section */}
            <div class="">
              <label class="text-sm font-medium">
                Entry Price <span class="text-red-500">*</span>
              </label>
              <TradeInput
                label="Entry Price"
                value={formData.price}
                onChange={e => handleFieldChange('price', e.target.value)}
                required
                type="text"
                placeholder="₹"
                error={errors.price}
              />
              <p class="text-sm text-gray-500">Press "-" to give a range</p>
            </div>

            {/* Stoploss */}
            <div>
              <label class="text-sm font-medium">
                Stop Loss <span class="text-red-500">*</span>
              </label>
              <TradeInput
                label="Stoploss"
                value={formData.stopLoss}
                onChange={e => handleFieldChange('stopLoss', e.target.value)}
                required
                type="number"
                placeholder="₹"
                error={errors.stopLoss}
              />
            </div>

            {/* Targets */}
            <div class="">
              <label class="text-sm font-medium">
                Target(s) <span class="text-red-500">*</span>
              </label>
              <TradeInput
                label="Target"
                value={formData.target}
                onChange={e => handleFieldChange('target', e.target.value)}
                required
                type="text"
                placeholder="₹"
                error={errors.target}
              />
              <p class="text-sm text-gray-500">Press "-" to give multiple targets (up to 3)</p>
            </div>

            {/* Time Period */}
            <div >
              <label class="text-sm font-medium">
                Time period <span class="text-red-500">*</span>
              </label>
              <select
                value={formData.timePeriod}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  timePeriod: e.target.value
                }))}
                class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Intraday">Intraday</option>
                <option value="Swing">Swing</option>
                <option value="Positional">Positional</option>
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
              </select>
            </div>

            {/* notes */}
            <div >
              <label class="text-sm font-medium">RA notes</label>
              <textarea
                value={formData.notes}
                onInput={e => {
                  const value = e.target.value;
                  const words = value.trim().split(/\s+/);
                  const newWordCount = value.trim() === '' ? 0 : words.length;

                  if (newWordCount <= 550) {
                    setFormData(prev => ({
                      ...prev,
                      notes: value.replace(/<[^>]*>/g, '') // Basic XSS prevention
                    }));
                    setWordCount(newWordCount);
                    // Clear error if below limit
                    setErrors(prev => ({ ...prev, notes: '' }));
                  } else {
                    // Set error if above limit
                    setErrors(prev => ({ ...prev, notes: 'RA Notes cannot exceed 550 words' }));
                  }
                }}
                placeholder="Enter a description..."
                class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
              />
              <div class="text-xs text-gray-500 flex justify-between">
                <span>{wordCount}/550</span>
                {errors.notes && <span class="text-red-500">{errors.notes}</span>}
              </div>
            </div>
          </div>


          {/* Action Footer */}
          <div class="border-t p-6">
            <div class="max-w-md mx-auto relative">
              {validFields !== requiredFields.length && Object.keys(errors).length > 0 ? (
                <div class="absolute right-full pr-1 top-1/3 -translate-y-1/2">
                  <div class="group relative">
                    <AlertCircle class="h-5 w-5 text-red-500" />
                    <div class="hidden group-hover:block absolute right-full top-1/2 -translate-y-1/2 w-48 p-2 bg-white border rounded-md shadow-lg mr-2">
                      <ul class="text-sm text-red-500">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              {validFields === requiredFields.length && (
                <button
                  onClick={handlePreviewClick}
                  class="absolute right-full pr-1 top-1/3 -translate-y-1/2"
                >
                  <Eye class="h-5 w-5 text-gray-500" />
                </button>
              )}

              <Button
                type={type.toLowerCase()}
                totalFields={requiredFields.length}
                validFields={validFields}
                onClick={handleSubmitClick}
              >
                <div class="flex items-center justify-center gap-2">
                  Post <Send class="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal would be implemented as a separate component */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        loading={previewLoading}
        llmResponse={llmResponse}
      />
    </div>
  );
};

export default NewTradePage;