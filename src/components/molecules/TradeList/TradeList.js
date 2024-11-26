import { h } from 'preact';
import {TradeCard} from '../TradeCard/TradeCard.js';

export const TradesList = ({ trades }) => (
  <div class="h-[500px] overflow-y-auto pr-4">
    <div class="space-y-4">
      {trades.map((trade) => (
        <TradeCard key={trade.id} trade={trade} />
      ))}
    </div>
  </div>
);