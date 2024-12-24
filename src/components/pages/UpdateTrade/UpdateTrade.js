import {h} from 'preact';
import { useState } from 'preact/hooks';
import { X, Send, Eye, AlertCircle } from 'lucide-preact';
import { route } from 'preact-router';
import { useTrade } from '../../../contexts/TradeContext';
import TradeInput from '../../atoms/TradeInput/TradeInput';
import Button from '../../atoms/Button/Button';
import PreviewModal from '../../organisms/PreviewModal';

const UpdateTrade = ({id}) => {
  const { getTrade, updateTrade } = useTrade();
  const trade = getTrade(id);
  if (!trade) {
    console.error(`Trade with id ${id} not found`);
    route('/'); // Consider a more specific error route or page
    return null;
  }
  console.log('inside')
  const [formData, setFormData] = useState({
    stopLoss: trade.stopLoss || '',
    target: trade.targets?.join('-') || '',
    notes: trade.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(
    trade.notes ? trade.notes.trim().split(/\s+/).length : 0
  );

  const validateField = (name, value) => {
    switch (name) {
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
            if (targets[i] <= targets[i - 1]) 
              return 'Each target must be greater than the previous one';
          }
        } else if (isNaN(parseFloat(value))) {
          return 'Invalid target value';
        }
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updates = {
      stopLoss: formData.stopLoss,
      targets: formData.target.includes('-') 
        ? formData.target.split('-').map(t => t.trim())
        : [formData.target],
      notes: formData.notes
    };

    updateTrade(trade.id, updates);
    route('/');
  };

  const requiredFields = ['stopLoss', 'target'];
  const validFields = requiredFields.filter(field => 
    formData[field] && !errors[field]
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Update call</h1>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => route('/')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="bg-white border-b px-4 py-2">
        <div className="max-w-3xl mx-auto flex gap-2">
          <span className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-sm font-medium">
            {trade.type}
          </span>
          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            {trade.tickerSymbol}
          </span>
          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            EQUITY
          </span>
          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
            {trade.timePeriod}
          </span>
        </div>
      </div>


      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium">
                Stop Loss <span className="text-red-500">*</span>
              </label>
              <TradeInput
                value={formData.stopLoss}
                onChange={e => handleFieldChange('stopLoss', e.target.value)}
                placeholder={`₹${trade.stopLoss}`}
                error={errors.stopLoss}
                type="number"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Target(s) <span className="text-red-500">*</span>
              </label>
              <TradeInput
                value={formData.target}
                onChange={e => handleFieldChange('target', e.target.value)}
                placeholder={`₹${trade.targets?.join('-')}`}
                error={errors.target}
              />
              <p className="text-sm text-gray-500">Press "-" to give multiple targets</p>
            </div>

            <div>
              <label className="text-sm font-medium">RA notes</label>
              <textarea
                value={formData.notes}
                onChange={e => handleFieldChange('notes', e.target.value)}
                placeholder="Enter a description..."
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
              />
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{wordCount}/500</span>
                {errors.notes && (
                  <span className="text-red-500">{errors.notes}</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t p-6">
            <div className="max-w-md mx-auto relative">
              {validFields !== requiredFields.length && Object.keys(errors).length > 0 && (
                <div className="absolute right-full pr-1 top-1/3 -translate-y-1/2">
                  <div className="group relative">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div className="hidden group-hover:block absolute right-full top-1/2 -translate-y-1/2 w-48 p-2 bg-white border rounded-md shadow-lg mr-2">
                      <ul className="text-sm text-red-500">
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
                  onClick={() => setShowPreview(true)}
                  className="absolute right-full pr-1 top-1/3 -translate-y-1/2"
                >
                  <Eye className="h-5 w-5 text-gray-500" />
                </button>
              )}

              <Button
                type={trade.type.toLowerCase()}
                totalFields={requiredFields.length}
                validFields={validFields}
                onClick={handleSubmit}
              >
                <div className="flex items-center justify-center gap-2">
                  Post <Send className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{ ...formData }}
        loading={false}
      />
    </div>
  );
};

export default UpdateTrade;