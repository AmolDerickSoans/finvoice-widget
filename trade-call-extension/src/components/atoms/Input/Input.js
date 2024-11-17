import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

const Input = ({
  value,
  onChange,
  onKeyAction,
  placeholder = '',
  type = 'text',
  macroSupport = null, // 'enter' or 'backspace'
  onNavigate,
  hasFocus = false
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleKeyDown = (e) => {
    // Navigation
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      onNavigate?.(e.key);
      return;
    }

    // Macro support
    if (macroSupport === 'enter' && e.key === 'Enter') {
      e.preventDefault();
      onKeyAction?.('enter');
      return;
    }

    if (macroSupport === 'backspace' && e.key === 'Backspace' && !value) {
      e.preventDefault();
      onKeyAction?.('backspace');
      return;
    }
  };

  return (
    <div class="input-container">
      <input
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        onInput={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        class="input-field"
      />
      {macroSupport === 'enter' && (
        <span class="input-icon enter">↵</span>
      )}
      {macroSupport === 'backspace' && !value && (
        <span class="input-icon backspace">⌫</span>
      )}
    </div>
  );
};

export default Input;