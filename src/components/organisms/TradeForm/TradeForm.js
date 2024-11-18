import { h } from 'preact';
import { useState } from 'preact/hooks';
import TabBar from '../../molecules/TabBar/TabBar';
import Button from '../../atoms/Button/Button';

const TradeFormLayout = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [validFields, setValidFields] = useState(0);
  const totalFields = 3; // Stock, Stoploss, Target fields

  const handleCopy = () => {
    console.log('Copying trade details...');
    // Add copy logic here
  };

  return (
    <div class="flex flex-col h-[600px] w-[400px] ">
    <div class=" bg-white rounded-lg shadow-lg p-2 space-y-4">
      {/* Top: Tab Bar */}
      <div class="flex-none">
        <TabBar onTabChange={setActiveTab} />
      </div>

      {/* Middle: Content Area */}
      <div class="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
        <span class="text-gray-400 italic">Form content will go here</span>
      </div>

    </div>

      {/* Bottom: Button */}
      <div class="flex-none">
        <Button 
          type={activeTab === 'new' ? 'buy' : 'reset'}
          totalFields={totalFields}
          validFields={validFields}
          onClick={handleCopy}
        >
          {activeTab === 'new' ? 'Copy Trade Details' : 'Reset'}
        </Button>
      </div>
    </div>
  );
};

export default TradeFormLayout;