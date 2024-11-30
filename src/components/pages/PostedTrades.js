import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Send } from 'lucide-react';
import TradeCard from '../molecules/TradeCard/TradeCard.js';
import { trades } from '../../assets/data/data.js';
import NewTradeCallModal from '../pages/newTrade.js';

const PostedTrades = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeTrades = trades;
    const countTrades = () => activeTrades.length;

    const handleNewTradeClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div class="w-full max-w-md bg-gray-50  rounded-lg">
            {/* Modal */}
            <NewTradeCallModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
            />

            <div class="p-4">
                {/* Header */}
                <div class="flex justify-between items-center mb-4">
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
                            class={`flex items-center px-4 py-2 -mb-px ${
                                activeTab === 'active'
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
                            class={`px-4 py-2 -mb-px ${
                                activeTab === 'completed'
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
                        <div>
                            {activeTrades.map((trade, index) => (
                                <TradeCard key={index} {...trade} />
                            ))}
                        </div>
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