import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { useTrade } from '../../contexts/TradeContext.js';
import { Send } from 'lucide-preact';
import TradeCard from '../molecules/TradeCard/TradeCard.js';
import NewTradeCallModal from '../pages/newTrade.js';
import UpdateTradeModal from './UpdateTrade/UpdateTrade.js';
const PostedTrades = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const { trades, activeTrades, updateTrade } = useTrade();

    const countTrades = () => (activeTrades ? trades.length : 0);

    const handleNewTradeClick = () => {
        setIsNewModalOpen(true);
    };
    const handleEditClick = (trade) => {
        setSelectedTrade(trade);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateTrade = (updatedData) => {
        if (selectedTrade && updatedData) {
            updateTrade(selectedTrade.id, updatedData);
            setIsUpdateModalOpen(false);
            setSelectedTrade(null);
        }
    };

    return (
        <div class="w-full h-full max-w-md bg-gray-50  rounded-lg">
            {/* New Trade Modal */}
            <NewTradeCallModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />
            {/* Update Trade Modal */}
            {isUpdateModalOpen && (
                <UpdateTradeModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    trade={selectedTrade}
                    onUpdate={handleUpdateTrade}
                />
            )}

            <div class="p-4">
                {/* Header */}
                <div class="flex justify-between items-center  mb-4">
                    <h2 class="text-xl font-semibold">Posted Trades</h2>
                    <button
                        class="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
                        onClick={handleNewTradeClick}
                    >
                        New <Send class="h-4 w-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div class="mb-4">
                    <div class="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('active')}
                            class={`flex items-center px-4 py-2 -mb-px ${activeTab === 'active'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-500'
                                }`}
                        >
                            Active
                            <span class="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                                {countTrades()}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            class={`px-4 py-2 -mb-px ${activeTab === 'completed'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-500'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Tab Contents */}
                <div class="h-96 overflow-y-auto">
                    {activeTab === 'active' && (
                        (!trades || trades.length === 0) ? (
                            <div class="flex flex-col items-center justify-center h-64 text-gray-500">
                                <p class="text-center mb-2">Click on new trade to add a trade</p>
                                <Send class="h-5 w-5" />
                            </div>
                        ) : (
                            <div>
                                {trades.map((trade) => (
                                    <TradeCard
                                        key={trade.id}
                                        type={trade.type}
                                        trade={trade}
                                        symbol={trade.tickerSymbol}
                                        category={trade.stockName}
                                        tradeType={`₹${trade.price.main}${trade.price.secondary ? ` - ₹${trade.price.secondary}` : ''}`}
                                        date={new Date(trade.updatedAt).toLocaleDateString()}
                                        time={new Date(trade.updatedAt).toLocaleTimeString()}
                                        onEditClick={handleEditClick}
                                    />
                                ))}
                            </div>
                        )
                    )}
                    {activeTab === 'completed' && (
                        <div>
                            {/* Completed trades would go here */}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div class="p-4 border-t border-gray-200 fixed bottom-0 left-0 right-0 bg-white">
                <button class="text-gray-600 hover:text-gray-800">
                    Go to FinoRA
                </button>
            </div>
        </div>
    );
};

export default PostedTrades;