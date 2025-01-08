import { h } from 'preact';
import { useState , useEffect } from 'preact/hooks';
import { useTrade } from '../../contexts/TradeContext.js';
import { route } from 'preact-router'; 
import { Send } from 'lucide-preact';
import TradeCard from '../molecules/TradeCard/TradeCard.js';

const PostedTrades = () => {


    const [activeTab, setActiveTab] = useState('active');
    const [selectedTrade, setSelectedTrade] = useState(null);
    
    // Use values from TradeContext
    const { trades, activeTrades, completedTrades } = useTrade();

  
    // Count trades based on active tab
    const countTrades = () => {
        if (activeTab === 'active') {
            return activeTrades.length;
        }
        return completedTrades.length;
    };

    const handleNewTradeClick = () => {
        route('/new-trade');
    };


    const handleEditClick = (trade) => {
        console.log(trade , `/update-trade/${trade.id}`)
        route(`/update-trade/${trade.id}`);
      };

    const handleExitClick = (trade) =>{
        route(`/exit-trade/${trade.id}`)
    }

    const handleDetailsClick = (trade) =>{
        route(`/trade-history/${trade.id}`)
    }

  
    const displayTrades = activeTab === 'active' ? activeTrades : completedTrades;
    const sortedTrades = displayTrades.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    return (
        <div class="w-full h-full max-w-md bg-gray-50 rounded-lg">

        <div class="flex flex-col min-w-screen h-screen">
            <main class="flex-1 p-1 flex items-center justify-center">
                <div class="w-full rounded-lg flex flex-col h-full bg-gray-50">
                    <div class="sticky top-0 z-10 bg-gray-50">
                        <div class="p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-semibold">Posted Trades</h2>
                                <button
                                    class="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
                                    onClick={handleNewTradeClick}
                                >
                                    New <Send class="h-4 w-4" />
                                </button>
                            </div>

                            <div class="mb-4">
                                <div class="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('active')}
                                        class={`flex items-center px-4 py-2 -mb-px ${
                                            activeTab === 'active'
                                                ? 'border-b-2 border-purple-600 text-purple-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        Active
                                        {activeTab === 'active' && (
                                            <span class="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                                                {countTrades()}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('completed')}
                                        class={`px-4 py-2 -mb-px ${
                                            activeTab === 'completed'
                                                ? 'border-b-2 border-purple-600 text-purple-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        Completed
                                        {activeTab === 'completed' && (
                                            <span class="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                                                {countTrades()}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                        {displayTrades.length === 0 ? (
                            <div class="flex flex-col items-center justify-center h-64 text-gray-500">
                                <p class="text-center mb-2">Click on new trade to add a trade</p>
                                <Send class="h-5 w-5" />
                            </div>
                        ) : (
                            <div>
                                {sortedTrades.map((trade) => (
                                    <TradeCard
                                        key={trade.id}
                                        type={trade.type}
                                        trade={trade}
                                        symbol={trade.tickerSymbol}
                                        timePeriod={trade.timePeriod}
                                        tradeType={'EQUITY'}
                                        date={new Date(trade.updatedAt).toLocaleDateString()}
                                        time={new Date(trade.updatedAt).toLocaleTimeString()}
                                        onEditClick={handleEditClick}
                                        onExitClick={handleExitClick}
                                        onDetailsClick={handleDetailsClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div class="p-4 border-t border-gray-200">
                        <button class="text-gray-600 hover:text-gray-800">Go to FinoRA</button>
                    </div>
                </div>
            </main>
        </div>
        </div>
    )
};

export default PostedTrades;