import { h, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

// Create the context with a default value
const TradeContext = createContext({
  trades: [],
  addTrade: () => {}
});

export function TradeProvider({ children }) {
  const [activeTrades, setActiveTrades] = useState([]);

  const value = {
    activeTrades,
    addTrade: (trade) => {
      const tradeWithTimestamp = {
        ...trade,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      setActiveTrades(prev => [tradeWithTimestamp, ...prev]);
    }
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

// Export the context itself
export default TradeContext;