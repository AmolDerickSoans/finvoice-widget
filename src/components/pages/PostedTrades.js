import { useState } from 'preact/hooks';
import { h } from 'preact';
import { Send } from 'lucide-react';
import TradeCard from '../molecules/TradeCard/TradeCard.js'
import {trades} from '../../assets/data/data.js';
const PostedTrades = () => {
    const [activeTab, setActiveTab] = useState('active');

    let activeTrades = trades;
    let countTrades = () => {
        return activeTrades.length;
    }
    console.log(trades)
    return (
        <div className="w-full max-w-md bg-gray-50 rounded-lg">
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Posted Trades</h2>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50">
                        New <Send className="h-4 w-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-4">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex items-center px-4 py-2 -mb-px ${activeTab === 'active'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-500'
                                }`}
                        >
                            Active
                            <span className="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                                {countTrades()}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 -mb-px ${activeTab === 'completed'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-500'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Tab Contents */}
                <div className="h-96 overflow-y-auto">
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
                <button className="text-gray-600 hover:text-gray-800">
                    Go to FinoRA
                </button>
            </div>
        </div>
    );
};

export default PostedTrades;