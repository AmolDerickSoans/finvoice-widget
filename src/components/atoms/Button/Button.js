import { h } from 'preact';
// import { useState, useEffect } from 'preact/hooks';

const Button = ({ 
  type = 'buy', 
  totalFields = 0,
  validFields = 0,
  onClick,
  children, 
  disabled = false
}) => {
  const progress = totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  //const isEnabled = progress === 100;
  const isEnabled = (type === 'reset' || type === 'update' || progress === 100);

  // Button type styles
  const typeStyles = {
    buy: {
      enabled: "hover:focus:green-600",
      progress: "bg-green-500",
      text: "text-white"
    },
    Sell: {
      enabled: "hover:bg-red-600",
      progress: "bg-red-500",
      text: "text-white"
    },
    reset: {
      enabled: "hover:bg-yellow-600",
      progress: "bg-yelow-500",
      text: "text-black"
    },
    update: {
      enabled: "hover:bg-purple-600",
      progress: "bg-purple-500",
      text: "text-white"
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.buy;

  return (
    <div class={`relative w-full rounded-md overflow-hidden px-4 py-2 
                 ${type === 'Sell' ? 'bg-red-100' : 
                   type === 'reset' ? 'bg-yellow-100 ' : 
                   type === 'update' ? 'bg-purple-100 ' :
                   'bg-green-100 '}`}>
      {/* Progress bar */}
      <div
        class={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${currentStyle.progress}`}
        style={{ width: `${progress}%` }}
      />

      {/* Button */}
      <button
        onClick={() =>{
            onClick(children || 'Copy',type)
        }}
        disabled={!isEnabled || disabled} 
        class={`
          relative w-full
          font-medium text-sm
          transition-all duration-200
          rounded-md
          ${(!isEnabled || disabled) ? currentStyle.enabled : 'cursor-not-allowed'}
          ${currentStyle.text}
          focus:outline-none focus:ring-1 focus:ring-offset-1
          ${type === 'buy' ? 'focus:ring-green-800' : type === 'Sell' ? 'focus:ring-red-800' : 'focus:ring-gray-800'}
        `}
      >
        {children || 'Copy'}
      </button>
    </div>
  );
};

export default Button;