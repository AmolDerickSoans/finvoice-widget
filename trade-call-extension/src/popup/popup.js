import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import TabBar from '../components/molecules/TabBar/TabBar';
import TradeForm from '../components/organisms/TradeForm/TradeForm';

const App = () => {
  const [activeTab, setActiveTab] = useState('New');

  return (
    <div class="app-container">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'New' && <TradeForm />}
      {activeTab === 'Update' && <div>Update form coming soon</div>}
      {activeTab === 'Exit' && <div>Exit form coming soon</div>}
    </div>
  );
};

render(<App />, document.getElementById('app'));