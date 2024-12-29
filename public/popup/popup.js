// popup/popup.js
import { h, render } from 'preact';
import { Router } from 'preact-router';
import 'preact/devtools'
import  PostedTrades from '../../src/components/pages/PostedTrades.js';
import NewTradePage from '../../src/components/pages/newTrade';

import { TradeProvider } from '../../src/contexts/TradeContext.js';
// Add CSS imports
import '../../styles/tailwind.css'
import UpdateTrade from '../../src/components/pages/UpdateTrade/UpdateTrade.js';
import ExitTrade from '../../src/components/pages/ExitTrade.js';
import TradeAudit from '../../src/components/pages/TradeAudit.js';
const App = () => {
  return (
  
    <TradeProvider>
     
    <div class="flex flex-col min-w-screen h-screen">
      <main class="flex-1 p-1 flex items-center justify-center">
      <Router>
       <PostedTrades path="/"/>
       {/* <PostedTrades path="/posted-trades" /> Added second path */}
       <UpdateTrade path="/update-trade/:id" />
       <ExitTrade path = "/exit-trade/:id" />
       <TradeAudit path="/trade-history/:id" />
       <NewTradePage path="/new-trade" />
       </Router>
      </main>
    </div>
    </TradeProvider>

  );
};

// Render the app
render(<App />, document.getElementById('app'));