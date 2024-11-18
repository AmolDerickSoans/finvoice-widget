import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { ArrowLeft, CornerDownLeft } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TradeInput = ({
  macro,
  onMacroTrigger,
  className,
  type = "text",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

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

  const showEnterIcon = macro === "enter" && isFocused;
  const showBackspaceIcon = macro === "backspace" && !value && isFocused;

  return (
    <div class="relative">
      <input
        {...props}
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        class={cn(
          "w-full rounded-md border px-3 py-2 text-base",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#4C8C41] focus:ring-offset-0",
          "placeholder:text-muted-foreground",
          showEnterIcon || showBackspaceIcon ? "pr-10" : "",
          className
        )}
      />
      {showEnterIcon && (
        <button
          onClick={() => onMacroTrigger?.(value)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <CornerDownLeft class="h-4 w-4" />
          <span class="sr-only">Submit</span>
        </button>
      )}
      {showBackspaceIcon && (
        <button
          onClick={() => onMacroTrigger?.(value)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft class="h-4 w-4" />
          <span class="sr-only">Back</span>
        </button>
      )}
    </div>
  );
};

export default TradeInput;