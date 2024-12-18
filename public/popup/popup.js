// popup/popup.js
import { h, render } from 'preact';
import  PostedTrades from '../../src/components/pages/PostedTrades.js'
// Add CSS imports
import '../../styles/tailwind.css'
const App = () => {
  return (
    <div class="flex flex-col min-w-screen ">
      <main class="flex-1 p-1 flex items-center justify-center">
       <PostedTrades/>
      </main>
    </div>
  );
};

// Render the app
render(<App />, document.getElementById('app'));