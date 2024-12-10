import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { X } from 'lucide-preact';
import Button from '../../atoms/Button/Button';
import { useTrade } from '../../../contexts/TradeContext';

const TradeUpdateForm = ({ trade, onClose }) => {
  const { updateTrade } = useTrade(); // Get updateTrade from context
  const [activeField, setActiveField] = useState('stoploss');
  const [stoplossValue, setStoplossValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const originalStoploss = trade.stopLoss?.toString() || '';
  const originalTarget = trade.targets?.[0]?.toString() || '';
  
  const inputRefs = {
    stoploss: useRef(null),
    target: useRef(null),
  };

  useEffect(() => {
    inputRefs.stoploss.current?.focus();
  }, []);

  useEffect(() => {
    if (activeField === 'stoploss') {
      inputRefs.stoploss.current?.focus();
    } else if (activeField === 'target') {
      inputRefs.target.current?.focus();
    }
  }, [activeField]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeField === 'stoploss') {
        setActiveField('target');
        inputRefs.target.current.focus();
        setStoplossValue(inputRefs.stoploss.current.value);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeField === 'target') {
        setActiveField('stoploss');
        inputRefs.stoploss.current.focus();
        setTargetValue(inputRefs.target.current.value);
      }
    }
  };

  const hasChanges = () => {
    const stoplossChanged = stoplossValue && stoplossValue !== originalStoploss;
    const targetChanged = targetValue && targetValue !== originalTarget;
    return stoplossChanged || targetChanged;
  };

  const handleUpdate = () => {
    if (!hasChanges()) {
      console.log('No changes detected');
      return;
    }

    // Prepare update data
    const updates = {};
    const metadata = {
      updateType: [],
      reason: 'Manual price adjustment'
    };

    if (stoplossValue && stoplossValue !== originalStoploss) {
      updates.stopLoss = parseFloat(stoplossValue);
      metadata.updateType.push('STOPLOSS_UPDATED');
    }

    if (targetValue && targetValue !== originalTarget) {
      updates.targets = [parseFloat(targetValue)];
      metadata.updateType.push('TARGET_UPDATED');
    }

    // Call context updateTrade with audit metadata
    updateTrade(trade.id, updates, metadata);

    // Create and copy update message
    const message = copyToClipboard();
    console.log('Update message:', message);
    
    setIsUpdated(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getTextColor = (field) => {
    const isActive = activeField === field;
    const hasValue = field === 'stoploss' ? Boolean(stoplossValue) : Boolean(targetValue);
    return isActive || hasValue ? 'text-black' : 'text-gray-300';
  };

  const copyToClipboard = () => {
    if (!hasChanges() || (!stoplossValue && !targetValue)) {
      return;
    }

    let message = `For ${trade.stockName}, modify:\n`;
    const parts = [];
  
    if (stoplossValue) {
      parts.push(`stoploss to ₹${stoplossValue}`);
    }
  
    if (targetValue) {
      if (stoplossValue) {
        parts.push(`and\ntarget to ₹${targetValue}`);
      } else {
        parts.push(`target to ₹${targetValue}`);
      }
    }
  
    message += parts.join(', ') + '.';
    
    navigator.clipboard.writeText(message)
      .then(() => console.log('Text copied to clipboard:', message))
      .catch(err => console.error('Failed to copy text:', err));

    return message;
  };

  return (
    <div
      class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">For {trade.stockName}, modify</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className={getTextColor('stoploss')}>
              stoploss to
            </span>
            <div className="relative inline-block">
              <input
                ref={inputRefs.stoploss}
                type="number"
                value={stoplossValue}
                onChange={(e) => setStoplossValue(e.target.value)}
                onFocus={() => setActiveField('stoploss')}
                onKeyDown={handleKeyDown}
                className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Price"
              />
            </div>
            <span className={getTextColor('stoploss')}>,and</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={getTextColor('target')}>
              target to
            </span>
            <div className="relative inline-block">
              <input
                ref={inputRefs.target}
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                onFocus={() => setActiveField('target')}
                onKeyDown={handleKeyDown}
                className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2" 
                placeholder="Price"
              />
            </div>
            <span className="text-gray-300">.</span>
          </div>
        </div>
      </div>
      <div className="mt-3 w-96">
        <Button
          type={isUpdated ? "success" : "update"}
          onClick={handleUpdate}
          disabled={!hasChanges() || (!stoplossValue && !targetValue)}
        >
          {isUpdated ? 'Updated!' : 'Update'}
        </Button>
      </div>
    </div>
  );
};

export default TradeUpdateForm;