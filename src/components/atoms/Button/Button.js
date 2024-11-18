import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const Button = ({ 
  type = 'buy', 
  totalFields = 0,
  validFields = 0,
  onClick,
  children 
}) => {
  const progress = totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  const isEnabled = progress === 100;

  // Button type styles
  const typeStyles = {
    buy: {
      enabled: "bg-green-600 hover:bg-green-700",
      progress: "bg-green-100",
      text: "text-white"
    },
    sell: {
      enabled: "bg-red-600 hover:bg-red-700",
      progress: "bg-red-100",
      text: "text-white"
    },
    reset: {
      enabled: "bg-gray-600 hover:bg-gray-700",
      progress: "bg-gray-100",
      text: "text-white"
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.buy;

  return (
    <div class="relative w-full rounded-md overflow-hidden">
      {/* Progress bar */}
      <div
        class={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${currentStyle.progress}`}
        style={{ width: `${progress}%` }}
      />

      {/* Button */}
      <button
        onClick={isEnabled ? onClick : undefined}
        disabled={!isEnabled}
        class={`
          relative w-full px-4 py-2 
          font-medium text-sm
          transition-all duration-200
          rounded-md
          ${isEnabled ? currentStyle.enabled : 'bg-green-200 cursor-not-allowed'}
          ${currentStyle.text}
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${type === 'buy' ? 'focus:ring-green-400' : type === 'sell' ? 'focus:ring-red-400' : 'focus:ring-gray-400'}
        `}
      >
        {children || 'Copy'}
      </button>
    </div>
  );
};

export default Button;