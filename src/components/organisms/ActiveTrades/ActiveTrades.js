// PostedTrades.js
import { h } from 'preact';
import { Tabs , TabsContent } from '../../atoms/Tabs/Tabs.js';
import {Header} from '../../atoms/Header/Header.js';
import {TabHeader} from '../../molecules/TabHeader/TabHeader.js';
import {TradesList} from '../../molecules/TradeList/TradeList.js';
import {CompletedTab} from '../CompletedTrades/CompletedTrades.js';
import { trades } from '../../../assets/data/data.js';

const ActiveTrades = () => {
  return (
    <div class="w-full max-w-3xl mx-auto p-6">
      <Header />

      <Tabs defaultValue="active" class="w-full">
        <TabHeader />
        
        <TabsContent value="active" class="mt-6">
          <TradesList trades={trades} />
        </TabsContent>
        
        <TabsContent value="completed" class="mt-6">
          <CompletedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActiveTrades;