import { h } from 'preact';
import { Button } from '../../atoms/Button/Button.js';
import { ArrowUpRight } from 'lucide-react';

export const Header = () => {
  return (
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Posted Trades</h1>
      <Button class="bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white">
        New <ArrowUpRight class="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

