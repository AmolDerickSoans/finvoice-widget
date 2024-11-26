import { h } from 'preact';
import { TabsList, TabsTrigger } from '../../atoms/Tabs/Tabs.js';
import { useState } from 'preact/hooks';

const tabStates = ["Active", "Completed"];

export const TabHeader = () => {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <TabsList class="w-full justify-start h-auto p-0 bg-transparent space-x-8">
      {tabStates.map((state) => (
        <TabsTrigger
          key={state.toLowerCase()}
          value={state.toLowerCase()}
          class={`pb-2 px-0 data-[state=active]:text-[#7F56D9] data-[state=active]:border-b-2 data-[state=active]:border-[#7F56D9] rounded-none ${activeTab === state.toLowerCase() ? 'data-[state=active]' : ''}`}
          onClick={() => setActiveTab(state.toLowerCase())}
        >
          {state} <span class="ml-2 text-sm text-muted-foreground">3</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};