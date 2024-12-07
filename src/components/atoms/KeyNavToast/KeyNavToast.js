import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ArrowUp, ArrowDown } from 'lucide-react';

const KeyboardNavigationHint = () => {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setActiveKey(e.key);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div class="text-sm p-1 bg-gray-700  flex items-center gap-2 justify-center rounded-lg">
      <span class="text-gray-300">Press</span>
      
      {/* Up Arrow */}
      <div class={`
        flex items-center justify-center
        w-5 h-5 rounded-lg
        transition-colors duration-100
        ${activeKey === 'ArrowUp' ? 'bg-gray-600' : 'bg-gray-800'}
      `}>
        <ArrowUp color='gray'
          class={`h-4 w-4 ${activeKey === 'ArrowUp' ? 'text-yellow-400' : 'text-gray-400'}`}
        />
      </div>
      
      {/* Down Arrow */}
      <div class={`
        flex items-center justify-center
        w-5 h-5 rounded-lg
        transition-colors duration-100
        ${activeKey === 'ArrowDown' ? 'bg-gray-600' : 'bg-gray-800'}
      `}>
        <ArrowDown color='gray'
          class={`h-4 w-4 ${activeKey === 'ArrowDown' ? 'text-yellow-400' : 'text-gray-400'}`}
        />
      </div>
      
      <span class="text-gray-300">to choose</span>
    </div>
  );
};

export default KeyboardNavigationHint;