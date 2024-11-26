import { h } from 'preact';
import { Button } from '../../atoms/Button/Button.js';
import { Badge } from '../../atoms/Badge/Badge.js';
import { Card } from '../../atoms/Card/Card.js';
import { ArrowUpRight, Pencil } from 'lucide-react';

export const TradeCard = ({ trade }) => (
  <Card class="p-4 group relative hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="space-y-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Badge
              variant="secondary"
              class="bg-[#ECFDF3] text-[#027A48] hover:bg-[#ECFDF3] px-2 py-0.5 text-xs font-medium"
            >
              {trade.type}
            </Badge>
            <span class="font-medium">{trade.symbol}</span>
          </div>
          <div class="flex items-center gap-2">
            <Badge
              variant="secondary"
              class="bg-gray-100 text-gray-700 hover:bg-gray-100"
            >
              {trade.category}
            </Badge>
            <Badge
              variant="secondary"
              class="bg-gray-100 text-gray-700 hover:bg-gray-100"
            >
              {trade.tradeType}
            </Badge>
          </div>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-sm text-gray-500">{trade.timestamp}</span>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
          >
            <Pencil class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
          >
            <ArrowUpRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);
