import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Send, Eye, AlertCircle, X } from 'lucide-preact';
import { useTrade } from '../../contexts/TradeContext';
import Button from '../atoms/Button/Button';
import TradeInput from '../atoms/TradeInput/TradeInput';
import TradeTypeToggle from '../molecules/TradeTypeToggle';
import PreviewModal from '../organisms/PreviewModal';
import { route } from 'preact-router';

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
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
            if (targets[i] <= targets[i-1]) return 'Each target must be greater than the previous one';
          }
        } else if (isNaN(parseFloat(value))) {
          return 'Invalid target value';
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
  };

  const handleFieldChange = (field, value) => {
    if (field === 'stock') {
      setSearchQuery(value);
      handleStockSearch(value);
    }
    
    setFormData(prev => {
      const updated = { ...prev };
      
      if (field === 'price') {
        if (value.includes('-')) {
          const [price, price2] = value.split('-').map(v => v.trim());
          updated.price = price;
          updated.price2 = price2 || '';
        } else {
          updated.price = value;
          updated.price2 = '';
        }
      } else if (field === 'target') {
        if (value.includes('-')) {
          const [target1, ...rest] = value.split('-').map(v => v.trim());
          updated.target = target1;
          updated.target2 = rest[0] || '';
          updated.target3 = rest[1] || '';
        } else {
          updated.target = value;
          updated.target2 = '';
          updated.target3 = '';
        }
      } else {
        updated[field] = value;
      }
      
      // Validate the changed field
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));

      console.log('Validation Errors:', error);
      
      return updated;
    });
  };


  // Search stock handling
  const handleStockSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`http://localhost:4000/stocks`);
      const data = await response.json();
      const filteredResults = data.filter( stock =>
        stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Stock search failed:', error);
    }
  };

  const handleStockSelect = (stock) => {
    setFormData(prev => ({
      ...prev,
      stock: stock.ticker,
      stockName: stock.name
    }));
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery(stock.name);
  };

  // Preview handling
  const handlePreview = async () => {
    if (!validateForm()) return;

    setShowPreview(true);
    // Mock LLM call - replace with actual implementation
    // const response = await fetch('/api/llm/preview', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    // const data = await response.json();
    // Handle preview data
  };

  // Form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Prepare trade data
    const tradeData = {
      type: type.toUpperCase(),
      stock: formData.stock,
      stockName: formData.stockName,
      price: formData.price,
      stopLoss: formData.stopLoss,
      target: formData.target,
      target2: formData.target2,
      target3: formData.target3,
      timePeriod: formData.timePeriod,
      notes: formData.notes
    };

    // Add trade using context
    addTrade(tradeData);

    // Navigate back
    route('/');
  };

  // Calculate form completion for button state
  const requiredFields = ['stock', 'price', 'stopLoss', 'target'];
  const validFields = requiredFields.filter(field =>
    formData[field] && !errors[field]
  ).length;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header class="bg-white border-b">
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
              <TradeInput
                label="Stock"
                value={searchQuery}
                onChange={e => {
                  const value = e.target.value;
                  console.log('Stock:', value);
                  handleFieldChange('stock', value);
                }}
                required
                placeholder="Search stocks..."
                error={errors.stock}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map(stock => (
                    <div
                      key={stock.symbol}
                      class="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleStockSelect(stock)}
                    >
                      <div class="font-medium">{stock.symbol}</div>
                      <div class="text-sm text-gray-600">{stock.name}</div>
                    </div>
                  ))}
                </div>
              )}
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
              onChange={e => {
                console.log('Stoploss:', e.target.value);
                setFormData(prev => ({
                  ...prev,
                  stopLoss: e.target.value
                }));
              }}
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

            {/* Notes */}
            <div >
              <label class="text-sm font-medium">RA notes</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  notes: e.target.value.replace(/<[^>]*>/g, '') // Basic XSS prevention
                }))}
                placeholder="Enter a description..."
                class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div class="border-t p-6">
            <div class="max-w-md mx-auto relative">
              {Object.keys(errors).length > 0 ? (
                <div class="absolute right-full pr-2 top-1/2 -translate-y-1/2">
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
                  onClick={handlePreview}
                  class="absolute right-full pr-2 top-1/2 -translate-y-1/2"
                >
                  <Eye class="h-5 w-5 text-gray-500" />
                </button>
              )}

              <Button
                type={type.toLowerCase()}
                totalFields={requiredFields.length}
                validFields={validFields}
                onClick={handleSubmit}
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
        loading={false}
      />
    </div>
  );
};

export default NewTradePage;