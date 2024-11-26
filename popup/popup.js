// popup/popup.js
import { h, render } from 'preact';
import TradeFormLayout from '../src/components/organisms/TradeForm/TradeForm.js';
import ActiveTrades from '../src/components/organisms/ActiveTrades/ActiveTrades.js';
// Add CSS imports
import '../styles/tailwind.css'
const App = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <main class="flex-1 p-1 flex items-center justify-center">
       <ActiveTrades />
      </main>
    </div>
  );
};

// Render the app
render(<App />, document.getElementById('app'));