import { h, createContext } from 'preact';
import { useState, useContext, useEffect } from 'preact/hooks';

const STORAGE_KEY = 'trade_data';

export const TRADE_STATUS = {
  ACTIVE: 'ACTIVE',
  UPDATED: 'UPDATED',
  COMPLETED: 'COMPLETED'
};

export const ACTION_TYPES = {
  CREATED: 'CREATED',
  PRICE_UPDATED: 'PRICE_UPDATED',
  TARGET_UPDATED: 'TARGET_UPDATED',
  STOPLOSS_UPDATED: 'STOPLOSS_UPDATED',
  EXITED: 'EXITED'
};

// Helper to safely parse stored data
const getStoredTrades = () => {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return [];
  }
};

// Helper to safely store data
const storeTrades = (trades) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error('Error writing to sessionStorage:', error);
  }
};

const createHistoryRecord = (action, changes = null, metadata = {}) => ({
  action,
  timestamp: new Date().toISOString(),
  changes,
  metadata
});

const TradeContext = createContext(null);

export function TradeProvider({ children }) {
  // Initialize state from sessionStorage
  const [trades, setTrades] = useState(() => getStoredTrades());

  // Update sessionStorage whenever trades change
  useEffect(() => {
    storeTrades(trades);
  }, [trades]);

  const addTrade = (trade) => {
    const newTrade = {
      ...trade,
      id: crypto.randomUUID(),
      status: TRADE_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        createHistoryRecord(ACTION_TYPES.CREATED, trade, {
          initialPrice: trade.price.main,
          initialStopLoss: trade.stopLoss,
          initialTargets: trade.targets
        })
      ]
    };

    setTrades(prev => {
      const updated = [newTrade, ...prev];
      return updated;
    });

    return newTrade.id;
  };

  const updateTrade = (tradeId, updates, metadata = {}) => {
    setTrades(prev => {
      const updated = prev.map(trade => {
        if (trade.id === tradeId) {
          let actionType = ACTION_TYPES.UPDATED;
          if ('price' in updates) actionType = ACTION_TYPES.PRICE_UPDATED;
          else if ('targets' in updates) actionType = ACTION_TYPES.TARGET_UPDATED;
          else if ('stopLoss' in updates) actionType = ACTION_TYPES.STOPLOSS_UPDATED;

          const previousValues = {};
          Object.keys(updates).forEach(key => {
            previousValues[`previous_${key}`] = trade[key];
          });

          return {
            ...trade,
            ...updates,
            status: updates.status || trade.status,
            updatedAt: new Date().toISOString(),
            history: [
              ...trade.history,
              createHistoryRecord(actionType, updates, {
                ...metadata,
                ...previousValues
              })
            ]
          };
        }
        return trade;
      });

      return updated;
    });
  };

  const exitTrade = (tradeId, exitDetails) => {
    setTrades(prev => {
      const updated = prev.map(trade => {
        if (trade.id === tradeId) {
          const exitChanges = {
            exitPrice: exitDetails.price,
            exitReason: exitDetails.reason,
            pnl: calculatePnL(trade, exitDetails.price),
            status: TRADE_STATUS.COMPLETED
          };

          return {
            ...trade,
            ...exitChanges,
            updatedAt: new Date().toISOString(),
            history: [
              ...trade.history,
              createHistoryRecord(ACTION_TYPES.EXITED, exitChanges, {
                holdingPeriod: calculateHoldingPeriod(trade.createdAt),
                previousStatus: trade.status
              })
            ]
          };
        }
        return trade;
      });

      return updated;
    });
  };

  const clearTrades = () => {
    setTrades([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // Helper functions
  const calculatePnL = (trade, exitPrice) => {
    const entryPrice = trade.price.main;
    const multiplier = trade.type === 'BUY' ? 1 : -1;
    return ((exitPrice - entryPrice) * multiplier).toFixed(2);
  };

  const calculateHoldingPeriod = (createdAt) => {
    const start = new Date(createdAt);
    const end = new Date();
    const hours = Math.floor((end - start) / (1000 * 60 * 60));
    return hours;
  };

  const getTradeAuditTrail = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return null;

    return trade.history.map(record => ({
      ...record,
      tradeId,
      tradeType: trade.type,
      stockName: trade.stockName
    }));
  };

  const value = {
    // State
    trades,
    activeTrades: trades.filter(t => t.status === TRADE_STATUS.ACTIVE),
    completedTrades: trades.filter(t => t.status === TRADE_STATUS.COMPLETED),

    // Actions
    addTrade,
    updateTrade,
    exitTrade,
    clearTrades,

    // Helpers
    getTradeAuditTrail,
    getTradeHistory: (tradeId) => trades.find(t => t.id === tradeId)?.history || [],
    getTrade: (tradeId) => trades.find(t => t.id === tradeId),

    // Stats
    totalTrades: trades.length,
    activeTradesCount: trades.filter(t => t.status === TRADE_STATUS.ACTIVE).length,
    completedTradesCount: trades.filter(t => t.status === TRADE_STATUS.COMPLETED).length
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
}