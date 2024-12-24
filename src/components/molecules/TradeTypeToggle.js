import { h } from 'preact';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TradeTypeToggle = ({ value, onChange }) => {
  return (
    <div class="flex rounded-lg overflow-hidden border">
      <button
        onClick={() => onChange('Buy')}
        class={cn(
          "flex-1 py-2 text-center transition-colors",
          value === 'Buy' 
            ? "bg-green-50 text-green-700" 
            : "bg-white text-gray-700"
        )}
      >
        Buy
      </button>
      <button
        onClick={() => onChange('Sell')}
        class={cn(
          "flex-1 py-2 text-center transition-colors",
          value === 'Sell' 
            ? "bg-red-50 text-red-700" 
            : "bg-white text-gray-700"
        )}
      >
        Sell
      </button>
    </div>
  );
};

export default TradeTypeToggle;