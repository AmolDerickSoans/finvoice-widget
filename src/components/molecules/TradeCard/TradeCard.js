import { useState } from 'preact/hooks';
import { h } from 'preact';
import { useTrade } from '../../../contexts/TradeContext';
import { Edit2, LogOut, ChevronRight } from 'lucide-preact';

const TradeCard = ({ type, symbol, timePeriod, tradeType, date, time, trade, onEditClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (trade && onEditClick) {
      onEditClick(trade);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm mb-3 relative transition-all duration-200 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs ${type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {type.toUpperCase()}
              </span>
              <h3 class="font-medium text-sm text-gray-900">{symbol}</h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex space-x-2 mt-1">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{timePeriod}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{tradeType}</span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{date}</div>
                <div>{time}</div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <div className="ml-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Expandable Action Buttons Section */}
      <div
        className={`
            border-t border-gray-100
            transition-all duration-200 ease-in-out
            ${isHovered ? 'h-12 opacity-100' : 'h-0 opacity-0 overflow-hidden'}
          `}
      >
        <div className="flex justify-between items-center px-4">
          <div className="flex space-x-2 py-2">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              onClick={handleEditClick}
            >
              <Edit2 className="h-4 w-4"
              />
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeCard;