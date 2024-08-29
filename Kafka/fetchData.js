const axios = require('axios');
require("dotenv").config();
const URL_API = process.env.URL_API;
const account = process.env.ACCOUNT;
exports.fetchStockData =  async function fetchStockData() {
    try {
        const response = await axios.post(URL_API, {
            TotalTradeRealRequest: { account: account }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

exports.processStockData =  function processStockData(apiResponse) {
    const stockData = apiResponse.TotalTradeRealReply.stockTotalReals.map(stock => ({
        ticker: stock.ticker,
        date: stock.date,
        open: stock.open,
        close: stock.close,
        high: stock.high,
        low: stock.low,
        volume: stock.vol
    }));

    return stockData;
}

/**
 * Get current local datetime in ISO format
 * @returns {string} Current local datetime in format 'YYYY-MM-DD HH:mm:ss'
 */
function getCurrentDatetime() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    return dateLocal.toISOString().slice(0, 19).replace("T", " ");
}
