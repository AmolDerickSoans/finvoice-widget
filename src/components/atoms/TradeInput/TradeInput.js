import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { ArrowLeft, CornerDownLeft } from 'lucide-preact';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TradeInput = ({
  macro,
  onMacroTrigger,
  className,
  type = "text",
  isSearch,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (macro === "enter" && e.key === "Enter") {
      e.preventDefault();
      onMacroTrigger?.(value);
    }
    if (macro === "backspace" && e.key === "Backspace" && !value) {
      e.preventDefault();
      onMacroTrigger?.(value);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (isSearch && containerRef.current) {
      // Store the container's width for transition back
      setContainerWidth(containerRef.current.offsetWidth);
      // Expand to fill available space
      containerRef.current.style.width = '100%';
      containerRef.current.style.flex = '1';
    }
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (isSearch && containerRef.current) {
      // Return to original width if no value
      if (!value) {
        containerRef.current.style.width = `${containerWidth}px`;
        containerRef.current.style.flex = 'none';
      }
    }
    props.onBlur?.(e);
  };

  const showEnterIcon = macro === "enter" && isFocused;
  const showBackspaceIcon = macro === "backspace" && !value && isFocused;

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-300 ease-in-out ${isSearch ? 'min-w-[100px]' : ''}`}
    >
      <input
        {...props}
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-base",
          "transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-[#4C8C41] focus:ring-offset-0",
          "placeholder:text-muted-foreground",
          showEnterIcon || showBackspaceIcon ? "pr-10" : "",
          className
        )}
      />
      {showEnterIcon && (
        <button
          onClick={() => onMacroTrigger?.(value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <CornerDownLeft className="h-4 w-4" />
          <span className="sr-only">Submit</span>
        </button>
      )}
      {showBackspaceIcon && (
        <button
          onClick={() => onMacroTrigger?.(value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </button>
      )}
    </div>
  );
};

export default TradeInput;