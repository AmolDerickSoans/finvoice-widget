import { h } from 'preact';

const Tab = ({ text, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      class={`
        flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150
        ${isActive 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {text}
    </button>
  );
};

export default Tab;