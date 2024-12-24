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


export { trades , mockStocks }