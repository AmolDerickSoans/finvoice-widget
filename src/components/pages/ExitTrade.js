import { h } from 'preact';
import { useState } from 'preact/hooks';
import { X, Send, Eye, AlertCircle } from 'lucide-preact';
import { route } from 'preact-router';
import { useTrade } from '../../contexts/TradeContext';
import TradeInput from '../atoms/TradeInput/TradeInput';
import Button from '../atoms/Button/Button';
import PreviewModal from '../organisms/PreviewModal';

const ExitTrade = ({id}) => {
  const { getTrade, exitTrade } = useTrade();
  const trade = getTrade(id);
  
  if (!trade) {
    console.error(`Trade with id ${id} not found`);
    route('/');
    return null;
  }

  const [formData, setFormData] = useState({
    exitPrice: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [llmResponse, setLlmResponse] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const validateField = (name, value) => {
    switch (name) {
      case 'exitPrice':
        if (!value) return 'Exit price is required';
        if (isNaN(parseFloat(value))) return 'Invalid exit price value';
        return '';

      case 'notes':
        const words = value.trim().split(/\s+/);
        const newWordCount = value.trim() === '' ? 0 : words.length;
        setWordCount(newWordCount);
        if (newWordCount > 500) return 'RA Notes cannot exceed 500 words';
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mockLLMCallExit = (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = `
Exit Trade Details:
**Stock:** ${trade.tickerSymbol}
**Name:** ${trade.stockName}
**Type:** ${trade.type.toUpperCase()}
**Entry Price:** ${trade.price.main}
**Exit Price:** ${formData.exitPrice}
**Time Period:** ${trade.timePeriod}
**RA Notes:** ${formData.notes}
`;
        resolve(response);
      }, 1500);
    });
  };

  const handleExitPreview = async () => {
    setShowPreview(true);
    setPreviewLoading(true);
    try {
      const response = await mockLLMCallExit(formData);
      setLlmResponse(response);
    } catch (error) {
      console.error(error);
      setLlmResponse('Error: ' + error.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitLoading(true);

    try {
      const response = await mockLLMCallExit(formData);
      exitTrade(trade.id, {
        price: formData.exitPrice,
        reason: formData.notes
      });
      copyToClipboard(response);
      route('/');
    } catch (error) {
      console.error('Error exiting trade:', error);
    } finally {
      setSubmitLoading(false);
      setShowPreview(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard.');
      });
  };

  const requiredFields = ['exitPrice'];
  const validFields = requiredFields.filter(field => 
    formData[field] && !errors[field]
  ).length;

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white border-b sticky top-0 z-10 shadow">
        <div class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-900">Exit Trade</h1>
          <button
            class="text-gray-600 hover:text-gray-900"
            onClick={() => route('/')}
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </header>

      <div class="bg-white border-b px-4 py-2">
        <div class="max-w-3xl mx-auto flex gap-2">
          <span class={`px-2 py-1 rounded-md text-sm font-medium ${
            trade.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trade.type}
          </span>
          <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            {trade.tickerSymbol}
          </span>
          <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            EQUITY
          </span>
          <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            {trade.timePeriod}
          </span>
        </div>
      </div>

      <main class="max-w-3xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 space-y-6">
            <div>
              <label class="text-sm font-medium">
                Exit Price <span class="text-red-500">*</span>
              </label>
              <TradeInput
                value={formData.exitPrice}
                onChange={e => handleFieldChange('exitPrice', e.target.value)}
                placeholder="₹"
                error={errors.exitPrice}
                type="number"
              />
            </div>

            <div>
              <label class="text-sm font-medium">RA notes</label>
              <textarea
                value={formData.notes}
                onChange={e => handleFieldChange('notes', e.target.value)}
                placeholder="Enter exit reason..."
                class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
              />
              <div class="text-xs text-gray-500 flex justify-between">
                <span>{wordCount}/500</span>
                {errors.notes && (
                  <span class="text-red-500">{errors.notes}</span>
                )}
              </div>
            </div>
          </div>

          <div class="border-t p-6">
            <div class="max-w-md mx-auto relative">
              {validFields !== requiredFields.length && Object.keys(errors).length > 0 && (
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
              )}

              {validFields === requiredFields.length && (
                <button
                  onClick={handleExitPreview}
                  disabled={previewLoading}
                  class="absolute right-full pr-1 top-1/3 -translate-y-1/2"
                >
                  <Eye class="h-5 w-5 text-gray-500" />
                </button>
              )}

              <Button
                type={trade.type}
                totalFields={requiredFields.length}
                validFields={validFields}
                onClick={handleSubmit}
                loading={submitLoading}
              >
                <div class="flex items-center justify-center gap-2">
                  Exit Trade <Send class="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          if (!previewLoading) {
            setLlmResponse('');
          }
        }}
        data={{ ...formData }}
        loading={previewLoading}
        llmResponse={llmResponse}
      />
    </div>
  );
};

export default ExitTrade;