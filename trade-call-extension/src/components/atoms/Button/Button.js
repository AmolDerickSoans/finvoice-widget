import { h } from 'preact';

const Button = ({ 
  onClick, 
  children, 
  disabled = false,
  progress = 0,
  variant = 'default' // 'default' | 'copy'
}) => {
  const baseStyles = 'relative w-full rounded-md transition-all duration-200';
  const variantStyles = {
    default: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700',
    copy: 'px-4 py-2 bg-green-600 text-white hover:bg-green-700'
  };

  return (
    <div class="relative">
      {variant === 'copy' && (
        <div 
          class="absolute inset-0 bg-green-100 rounded-md transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }}
        />
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        class={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;