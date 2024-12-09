//import { NseIndia } from 'stock-nse-india';
import { createClient } from '@supabase/supabase-js'
//const nseIndia = new NseIndia();
// Constants
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache structure
const CACHE_CONFIG = {
  key: 'stockCache',
  version: '1.0',
  maxItems: 500 // Limit cache size
};
const supabase = createClient(

  
)
// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Trade Call Widget installed/updated');
  //await initializeCache();
  //await cacheAllStockSymbols(); // Cache stock symbols on installation
  //await checkAuth();
  await chrome.sidePanel.setOptions({
    enabled: true,
    path: 'popup.html'
  });
});

// Check auth state when extension opens
chrome.runtime.onStartup.addListener(async() => {
//  await checkAuth();
 console.log('on startup checked auth')
});

async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log('checking auth')
  if (error || !session) {
    // If not authenticated, open auth popup
    chrome.windows.create({
      url: 'auth.html',
      type: 'popup',
      width: 400,
      height: 600
    });
  }
}

// Listen for messages from auth popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'AUTH_SUCCESS') {
    // Close auth window and refresh main extension
    chrome.windows.remove(sender.tab.windowId);
    chrome.runtime.reload();
  }
});

// Function to cache all stock symbols
/**
 * Fetches all stock symbols from the NseIndia instance and caches them in local storage.
 */
async function cacheAllStockSymbols() {
  try {
    const symbols = await nseIndia.getAllStockSymbols();
    console.log(symbols);

    // Store symbols in local storage
    await chrome.storage.local.set({ [CACHE_CONFIG.key]: { symbols, lastUpdated: Date.now() } });
    console.log('Stock symbols cached successfully.');
  } catch (error) {
    console.error('Failed to fetch and cache stock symbols:', error);
  }
}

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked'); // Log when the icon is clicked
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log('Side panel behavior set successfully');
  } catch (error) {
    console.error('Error setting side panel behavior:', error);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'SEARCH_STOCKS':
      handleStockSearch(request.query).then(sendResponse);
      return true; // Will respond asynchronously

    case 'FETCH_STOCK_DETAILS':
        //add fetch logic if needed
        updateCache()
      return true;

    case 'CLEAR_CACHE':
      clearCache().then(sendResponse);
      return true;
  }
});

// Cache Management
/**
 * Initializes the cache in local storage if it does not already exist.
 */
async function initializeCache() {
  const cache = await chrome.storage.local.get(CACHE_CONFIG.key);
  if (!cache[CACHE_CONFIG.key]) {
    await chrome.storage.local.set({
      [CACHE_CONFIG.key]: {
        version: CACHE_CONFIG.version,
        lastUpdated: Date.now(),
        data: {},
        searchIndex: {}
      }
    });
  }
}

/**
 * Retrieves the current cache from local storage.
 */
async function getCache() {
  const cache = await chrome.storage.local.get(CACHE_CONFIG.key);
  return cache[CACHE_CONFIG.key];
}

/**
 * Updates the cache with new stock data and refreshes the search index.
 * @param {Object} newData - The new stock data to be added to the cache.
 */
async function updateCache(j) {
  const cache = await getCache();
  const updatedCache = {
    ...cache,
    lastUpdated: Date.now(),
    data: {
      ...cache.data,
      ...newData
    }
  };

  // Update search index
  Object.entries(newData).forEach(([symbol, details]) => {
    const searchTerms = generateSearchTerms(symbol, details.name);
    searchTerms.forEach(term => {
      if (!updatedCache.searchIndex[term]) {
        updatedCache.searchIndex[term] = [];
      }
      if (!updatedCache.searchIndex[term].includes(symbol)) {
        updatedCache.searchIndex[term].push(symbol);
      }
    });
  });

  await chrome.storage.local.set({ [CACHE_CONFIG.key]: updatedCache });
  return updatedCache;
}

/**
 * Clears the cache and reinitializes it.
 */
async function clearCache() {
  await initializeCache();
  return { success: true };
}

// Search functionality
/**
 * Generates a set of search terms from a stock symbol and its name.
 * @param {string} symbol - The stock symbol.
 * @param {string} name - The stock name.
 * @returns {Array} - An array of search terms.
 */

/**
 * Searches the cache for stocks matching the provided query.
 * @param {string} query - The search query.
 * @returns {Array} - An array of matching stocks.
 */
async function handleStockSearch(query) {
  try {
    if (!query || query.length < 2) return [];

    const cache = await getCache();
    query = query.toLowerCase();

    // Check if cache needs refresh
    if (Date.now() - cache.lastUpdated > CACHE_DURATION) {
      await refreshStockList();
    }

    // Search in cache first
    const matches = new Set();
    Object.entries(cache.searchIndex).forEach(([term, symbols]) => {
      if (term.includes(query)) {
        symbols.forEach(symbol => matches.add(symbol));
      }
    });

    // Return matched stocks from cache
    return Array.from(matches).map(symbol => ({
      symbol,
      ...cache.data[symbol]
    })).slice(0, 10); // Limit results

  } catch (error) {
    console.error('Stock search error:', error);
    return [];
  }
}


// Error handling and logging
/**
 * Logs errors to the console with an optional context message.
 * @param {Error} error - The error to log.
 * @param {string} context - Optional context for the error.
 */
function logError(error, context = '') {
  console.error(`Trade Call Widget Error ${context}:`, error);
  // Could implement error reporting service here
}

// Optional: Performance monitoring
const performanceMetrics = {
  searches: 0,
  cacheHits: 0,
  apiCalls: 0
};

// Optional: Debug logging in development
if (process.env.NODE_ENV === 'development') {
  chrome.storage.local.onChanged.addListener((changes, namespace) => {
    console.log('Storage changes:', changes);
  });
}