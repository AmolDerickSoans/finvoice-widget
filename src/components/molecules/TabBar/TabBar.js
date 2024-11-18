import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const TabsTrigger = ({ 
  value, 
  activeValue, 
  onClick, 
  buttonRef, 
  children,
  autoFocus 
}) => (
  <button
    ref={buttonRef}
    onClick={() => onClick(value)}
    role="tab"
    aria-selected={activeValue === value}
    tabIndex={activeValue === value ? 0 : -1}
    autoFocus={autoFocus}
    class={cn(
      "rounded transition-all duration-200 ease-in-out",
      "text-base font-normal outline-none",
      "flex-1 px-4 py-2",
      activeValue === value 
        ? "bg-white text-[#4C8C41] shadow-md" 
        : "text-gray-500",
      "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400"
    )}
  >
    {children}
  </button>
);

const TabBar = ({ onTabChange = () => {} }) => {
  const [activeTab, setActiveTab] = useState("new");
  const tabRefs = useRef([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Focus the "New" tab on initial mount
    if (isInitialMount.current) {
      tabRefs.current[0]?.focus();
      isInitialMount.current = false;
    }
  }, []);

  const tabs = [
    { id: "new", label: "New" },
    { id: "update", label: "Update" },
    { id: "exit", label: "Exit" }
  ];

  const handleKeyNavigation = (e) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "ArrowRight":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      default:
        return;
    }

    const newTab = tabs[nextIndex].id;
    setActiveTab(newTab);
    onTabChange(newTab);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div class="w-full">
      <div 
        role="tablist" 
        aria-label="Trade options"
        onKeyDown={handleKeyNavigation}
        class="grid w-full grid-cols-3 p-1 h-14 bg-gray-100 rounded"
      >
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            activeValue={activeTab}
            onClick={handleTabClick}
            buttonRef={el => tabRefs.current[index] = el}
            autoFocus={tab.id === "new"}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </div>
    </div>
  );
};

export default TabBar;