import {h} from 'preact' 
import { useState} from 'preact/hooks';
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-preact';
import { route } from 'preact-router';
import { useTrade } from '../../contexts/TradeContext';

const TradeAudit = ({ id }) => {
  const { getTradeAuditTrail, getTrade } = useTrade();
  const [expandedAction, setExpandedAction] = useState(null);
  
  const trade = getTrade(id);
  if (!trade) {
    route('/');
    return null;
  }

  const auditTrail = getTradeAuditTrail(id);

  const formatChange = (changes) => {
    if (!changes) return '';
    return Object.entries(changes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => route('/')} className="text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Trade History</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow">
          {auditTrail?.map((record, index) => {
            const isUpdate = record.action.includes('UPDATED');
            const isExit = record.action === 'EXITED';
            
            if (!isUpdate && !isExit) return null;

            return (
              <div key={index} className="border-b last:border-b-0">
                <button
                  onClick={() => setExpandedAction(expandedAction === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {expandedAction === index ? 
                      <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    }
                    <span className="font-medium">{record.action.replace('_', ' ')}</span>
                    <span className="text-sm text-gray-500">
                      {formatTime(record.timestamp)}
                    </span>
                  </div>
                </button>

                {expandedAction === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-3 text-sm">
                      {record.changes && (
                        <div>
                          <span className="font-medium text-gray-700">Changes: </span>
                          <span className="text-gray-600">{formatChange(record.changes)}</span>
                        </div>
                      )}
                      {record.metadata && (
                        <div>
                          <span className="font-medium text-gray-700">Additional Info: </span>
                          <span className="text-gray-600">{formatChange(record.metadata)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TradeAudit;