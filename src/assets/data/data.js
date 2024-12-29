const trades = [
    {
        type: "SELL",
        symbol: "HDFC",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "11:15:45 AM"
    },
    {
        type: "BUY",
        symbol: "TCS",
        category: "EQUITY",
        tradeType: "POSITIONAL",
        date: "24 Oct 2024",
        time: "11:30:22 AM"
    },
    {
        type: "SELL",
        symbol: "ICICI",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "12:05:10 PM"
    },
    {
        type: "BUY",
        symbol: "BHARTIARTL",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "12:45:33 PM"
    },
    {
        type: "SELL",
        symbol: "WIPRO",
        category: "EQUITY",
        tradeType: "POSITIONAL",
        date: "24 Oct 2024",
        time: "01:20:15 PM"
    },
    {
        type: "BUY",
        symbol: "HCLTECH",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "01:55:40 PM"
    },
    {
        type: "SELL",
        symbol: "SBIN",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "02:10:05 PM"
    },
    {
        type: "BUY",
        symbol: "INFY",
        category: "EQUITY",
        tradeType: "POSITIONAL",
        date: "24 Oct 2024",
        time: "02:30:18 PM"
    },
    {
        type: "SELL",
        symbol: "LT",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "02:45:50 PM"
    },
    {
        type: "BUY",
        symbol: "MARUTI",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "03:15:25 PM"
    },
    {
        type: "SELL",
        symbol: "LT",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "02:45:50 PM"
    },
    {
        type: "BUY",
        symbol: "MARUTI",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "03:15:25 PM"
    },
    {
        type: "SELL",
        symbol: "LT",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "02:45:50 PM"
    },
    {
        type: "BUY",
        symbol: "MARUTI",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "03:15:25 PM"
    },
    {
        type: "SELL",
        symbol: "LT",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "02:45:50 PM"
    },
    {
        type: "BUY",
        symbol: "MARUTI",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "03:15:25 PM"
    },
    {
        type: "SELL",
        symbol: "LT",
        category: "EQUITY",
        tradeType: "SWING",
        date: "24 Oct 2024",
        time: "02:45:50 PM"
    },
    {
        type: "BUY",
        symbol: "MARUTI",
        category: "EQUITY",
        tradeType: "INTRADAY",
        date: "24 Oct 2024",
        time: "03:15:25 PM"
    }
]

const mockStocks = [
    { stockName: 'Reliance Industries Ltd', tickerSymbol: 'RELIANCE' },
    { stockName: 'HDFC Bank Ltd', tickerSymbol: 'HDFCBANK' },
    { stockName: 'Hindustan Unilever Ltd', tickerSymbol: 'HUL' },
    { stockName: 'Infosys Ltd', tickerSymbol: 'INFY' },
    { stockName: 'ICICI Bank Ltd', tickerSymbol: 'ICICIBANK' },
    { stockName: 'Kotak Mahindra Bank Ltd', tickerSymbol: 'KOTAKBANK' },
    { stockName: 'Larsen & Toubro Ltd', tickerSymbol: 'LT' },
    { stockName: 'Maruti Suzuki India Ltd', tickerSymbol: 'MARUTI' },
    { stockName: 'Bajaj Finance Ltd', tickerSymbol: 'BAJFINANCE' },
    { stockName: 'Bharat Petroleum Corporation Ltd', tickerSymbol: 'BPCL' },
    { stockName: 'Tata Consultancy Services Ltd', tickerSymbol: 'TCS' },
    { stockName: 'HCL Technologies Ltd', tickerSymbol: 'HCLTECH' },
    { stockName: 'Axis Bank Ltd', tickerSymbol: 'AXISBANK' },
    { stockName: 'Bharti Airtel Ltd', tickerSymbol: 'BHARTIARTL' },
    { stockName: 'State Bank of India', tickerSymbol: 'SBIN' },
    { stockName: 'Power Grid Corporation of India Ltd', tickerSymbol: 'POWERGRID' },
    { stockName: 'NTPC Ltd', tickerSymbol: 'NTPC' },
    { stockName: 'Tata Motors Ltd', tickerSymbol: 'TATAMOTORS' },
    { stockName: 'ITC Ltd', tickerSymbol: 'ITC' },
    { stockName: 'Hindalco Industries Ltd', tickerSymbol: 'HINDALCO' },
    { stockName: 'Bharat Heavy Electricals Ltd', tickerSymbol: 'BHEL' },
    { stockName: 'Coal India Ltd', tickerSymbol: 'COALINDIA' },
    { stockName: 'Tata Steel Ltd', tickerSymbol: 'TATASTEEL' },
    { stockName: 'JSW Steel Ltd', tickerSymbol: 'JSWSTEEL' },
    { stockName: 'Hero MotoCorp Ltd', tickerSymbol: 'HEROMOTOCO' },
    { stockName: 'Dr Reddy\'s Laboratories Ltd', tickerSymbol: 'DRREDDY' },
    { stockName: 'Sun Pharmaceutical Industries Ltd', tickerSymbol: 'SUNPHARMA' },
    { stockName: 'Titan Company Ltd', tickerSymbol: 'TITAN' },
    { stockName: 'Adani Enterprises Ltd', tickerSymbol: 'ADANIENT' },
    { stockName: 'Adani Ports and Special Economic Zone Ltd', tickerSymbol: 'ADANIPORTS' },
    { stockName: 'Adani Green Energy Ltd', tickerSymbol: 'ADANIGREEN' },
    { stockName: 'HDFC Life Insurance Company Ltd', tickerSymbol: 'HDFCLIFE' },
    { stockName: 'HDFC Asset Management Company Ltd', tickerSymbol: 'HDFCAMC' }
];

const conservativeTrader = [
    {
      call_type: "Long",
      symbol: "JNJ",  // Johnson & Johnson
      entry_price: 165.00,
      stop_loss: 160.00,
      targets: [170.00, 175.00, 180.00],
      rationale: "Defensive stock with a strong dividend yield. Expecting modest growth in the healthcare sector. Tight stop-loss to minimize risk.",
      timeframe: "3-6 months",
      confidence: "Medium"
    },
    {
      call_type: "Long",
      symbol: "KO",  // Coca-Cola
      entry_price: 60.50,
      stop_loss: 58.00,
      targets: [63.00, 65.00],
      rationale: "Stable consumer staples stock. Consistent earnings and a reliable brand. Positioned for slow but steady appreciation.",
      timeframe: "6-12 months",
      confidence: "High"
    },
    {
      call_type: "Long",
      symbol: "PG", // Procter & Gamble
      entry_price: 140.00,
      stop_loss: 136.00,
      targets: [145.00, 148.00, 152.00],
      rationale: "Market leader in consumer goods. Expecting increased demand due to new product innovations. Strong balance sheet.",
      timeframe: "4-8 months",
      confidence: "Medium-High"
    }
  ];
  const aggressiveTrader = [
    {
      call_type: "Long",
      symbol: "TSLA", // Tesla
      entry_price: 255.00,
      stop_loss: 230.00,
      targets: [280.00, 300.00, 350.00],
      catalyst: "Upcoming earnings report, potential for positive surprise",
      risk: "High",
      expiry: "2 weeks"
    },
    {
      call_type: "Long",
      symbol: "NVDA", // NVIDIA
      entry_price: 450.00,
      stop_loss: 420.00,
      targets: [500.00, 550.00],
      catalyst: "Strong demand for AI chips, new product launch",
      risk: "Medium-High",
      expiry: "1 month"
    },
    {
      call_type: "Long",
      symbol: "AMD", // Advanced Micro Devices
      entry_price: 100.00,
      stop_loss: 90.00,
      targets: [115.00, 125.00, 130.00],
      catalyst: "Gaining market share from Intel, positive industry outlook",
      risk: "Medium",
      expiry: "3 weeks"
    }
  ];

  const technicalTrader = [
    {
      call_type: "Long",
      symbol: "AAPL", // Apple
      entry_price: 175.50,
      stop_loss: 172.00,
      targets: [180.00, 185.00, 190.00],
      indicators: {
        SMA50: "Crossed above",
        RSI: "Oversold (30)",
        MACD: "Bullish divergence"
      },
      pattern: "Double bottom"
    },
    {
      call_type: "Long",
      symbol: "MSFT", // Microsoft
      entry_price: 330.00,
      stop_loss: 325.00,
      targets: [340.00, 345.00],
      indicators: {
        BollingerBands: "Price at lower band",
        Stochastics: "Oversold crossover"
      },
      pattern: "Falling wedge breakout"
    },
    {
      call_type: "Long",
      symbol: "AMZN", // Amazon
      entry_price: 135.00,
      stop_loss: 130.00,
      targets: [142.00, 148.00, 155.00],
      indicators: {
        Volume: "Above average on breakout",
        FibonacciRetracement: "61.8% support held"
      },
      pattern: "Ascending triangle"
    }
  ];
  const twitterTrader =  "New long position initiated on AAPL @ 175.50. Chart shows a double bottom formation. Key indicators: SMA50 crossed above, RSI oversold (30), bullish divergence on MACD. Stop loss set at 172. Targets: 180, 185, 190. Trade invalidated if the pattern fails. #TechnicalAnalysis #Apple"


export { trades , mockStocks , twitterTrader,conservativeTrader , aggressiveTrader , technicalTrader}