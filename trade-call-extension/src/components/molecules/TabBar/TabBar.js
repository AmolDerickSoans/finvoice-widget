import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const TabsTrigger = ({ 
  value, 
  activeValue, 
  onClick, 
  ref, 
  children 
}) => (
  <button
    ref={ref}
    onClick={() => onClick(value)}
    class={cn(
      "rounded-[5px] transition-all duration-200 ease-in-out",
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

const TabBar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("new");
  const tabRefs = useRef([]);

  const tabs = [
    { id: "new", label: "New" },
    { id: "update", label: "Update" },
    { id: "exit", label: "Exit" }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        const nextIndex = e.key === "ArrowRight"
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length;
        
        const newTab = tabs[nextIndex].id;
        setActiveTab(newTab);
        onTabChange(newTab);
        tabRefs.current[nextIndex]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, onTabChange]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div class="w-full">
      <div class="grid w-full grid-cols-3 p-1 h-14 bg-gray-100 rounded-[5px]">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            activeValue={activeTab}
            onClick={handleTabClick}
            ref={el => tabRefs.current[index] = el}
          >
            {tab.id === "new" ? tab.label : "Coming Soon"}
          </TabsTrigger>
        ))}
      </div>
    </div>
  );
};

export default TabBar;