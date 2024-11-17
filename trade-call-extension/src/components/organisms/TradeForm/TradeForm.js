import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';

const TradeForm = () => {
  const [formState, setFormState] = useState({
    action: 'Buy',
    stock: '',
    price: '',
    priceRange: false,
    priceHigh: '',
    stoploss: '',
    target: '',
    targetRange: false
  });

  const [activeField, setActiveField] = useState('stock');
  const [completion, setCompletion] = useState(0);

  const fields = [
    'stock',
    'price',
    ...(formState.priceRange ? ['priceHigh'] : []),
    'stoploss',
    'target',
    ...(formState.targetRange ? ['targetHigh'] : [])
  ];

  const handleFieldNavigation = (direction, currentField) => {
    const currentIndex = fields.indexOf(currentField);
    const nextIndex = direction === 'ArrowDown'
      ? (currentIndex + 1) % fields.length
      : (currentIndex - 1 + fields.length) % fields.length;
    setActiveField(fields[nextIndex]);
  };

  const toggleAction = () => {
    setFormState(prev => ({
      ...prev,
      action: prev.action === 'Buy' ? 'Sell' : 'Buy'
    }));
  };

  const handlePriceEnter = () => {
    setFormState(prev => ({
      ...prev,
      priceRange: !prev.priceRange,
      priceHigh: ''
    }));
  };

  const updateCompletion = () => {
    const requiredFields = ['stock', 'price', 'stoploss', 'target'];
    const filledFields = requiredFields.filter(field => formState[field]?.trim()).length;
    setCompletion((filledFields / requiredFields.length) * 100);
  };

  useEffect(updateCompletion, [formState]);

  const generateMessage = () => {
    const { action, stock, price, priceRange, priceHigh, stoploss, target } = formState;
    return `${action} ${stock} at ${priceRange ? `${price}-${priceHigh}` : price}.
Set stoploss at ${stoploss}.
Target for ${target}.`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateMessage());
      // Optional: Show success message
    } catch (err) {
      console.error('Failed to copy:', err);
      // Optional: Show error message
    }
  };

  return (
    <div class="trade-form">
      <button
        onClick={toggleAction}
        class={`action-toggle ${formState.action.toLowerCase()}`}
      >
        {formState.action} ↵
      </button>

      <div class="form-fields">
        <Input
          value={formState.stock}
          onChange={val => setFormState(prev => ({ ...prev, stock: val }))}
          placeholder="Enter stock name/symbol"
          hasFocus={activeField === 'stock'}
          onNavigate={direction => handleFieldNavigation(direction, 'stock')}
        />

        <div class="price-group">
          <Input
            type="number"
            value={formState.price}
            onChange={val => setFormState(prev => ({ ...prev, price: val }))}
            placeholder="Price"
            macroSupport="enter"
            onKeyAction={handlePriceEnter}
            hasFocus={activeField === 'price'}
            onNavigate={direction => handleFieldNavigation(direction, 'price')}
          />
          {formState.priceRange && (
            <Input
              type="number"
              value={formState.priceHigh}
              onChange={val => setFormState(prev => ({ ...prev, priceHigh: val }))}
              placeholder="High price"
              hasFocus={activeField === 'priceHigh'}
              onNavigate={direction => handleFieldNavigation(direction, 'priceHigh')}
            />
          )}
        </div>

        <Input
          type="number"
          value={formState.stoploss}
          onChange={val => setFormState(prev => ({ ...prev, stoploss: val }))}
          placeholder="Stoploss"
          macroSupport="backspace"
          hasFocus={activeField === 'stoploss'}
          onNavigate={direction => handleFieldNavigation(direction, 'stoploss')}
        />

        <Input
          type="number"
          value={formState.target}
          onChange={val => setFormState(prev => ({ ...prev, target: val }))}
          placeholder="Target"
          macroSupport="enter"
          hasFocus={activeField === 'target'}
          onNavigate={direction => handleFieldNavigation(direction, 'target')}
        />
      </div>

      <Button
        variant="copy"
        onClick={copyToClipboard}
        disabled={completion < 100}
        progress={completion}
      >
        Copy
      </Button>
    </div>
  );
};

export default TradeForm;