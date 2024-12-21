import { h } from 'preact';
// import { useState, useEffect } from 'preact/hooks';

const Button = ({ 
  type = 'buy', 
  totalFields = 0,
  validFields = 0,
  onClick,
  children 
}) => {
  const progress = totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  const isEnabled = type === 'reset' ? true : (progress === 100);

  // Button type styles
  const typeStyles = {
    buy: {
      enabled: "bg-green-600 hover:bg-green-600",
      progress: "bg-green-600",
      text: "text-white"
    },
    sell: {
      enabled: "bg-red-600 hover:bg-red-600",
      progress: "bg-red-600",
      text: "text-white"
    },
    reset: {
      enabled: "bg-yellow-500 hover:bg-yellow-500",
      progress: "bg-yellow-100",
      text: "text-black"
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.buy;

  return (
    <div class={`relative w-full rounded-md overflow-hidden px-4 py-2 
                 ${type === 'sell' ? 'bg-red-100 focus:ring-red-800' : 
                   type === 'reset' ? 'bg-yellow-500 focus:ring-yellow-800' : 
                   'bg-green-100 focus:ring-green-800'}`}>
      {/* Progress bar */}
      <div
        class={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${currentStyle.progress}`}
        style={{ width: `${progress}%` }}
      />

      {/* Button */}
      <button
        onClick={() => onClick(children || 'Copy', type)}
        disabled={!isEnabled}
        class={`
          relative w-full
          font-medium text-sm
          transition-all duration-200
          rounded-md
          ${isEnabled ? currentStyle.enabled : 'cursor-not-allowed'}
          ${currentStyle.text}
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${type === 'buy' ? 'focus:ring-green-800' : type === 'sell' ? 'focus:ring-red-800' : 'focus:ring-gray-800'}
        `}
      >
        {children || 'Copy'}
      </button>
    </div>
  );
};

export default Button;