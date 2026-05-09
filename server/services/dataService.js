const axios = require("axios");

async function getHistoricalPrices(
  symbol = "BTCUSDT",
  interval = "5m",
  limit = 100
) {

  try {

    const url =
      `https://api.binance.com/api/v3/klines` +
      `?symbol=${symbol}` +
      `&interval=${interval}` +
      `&limit=${limit}`;

    console.log("📡 Fetching:", url);

    const res = await axios.get(url);

    return res.data.map(c =>
      parseFloat(c[4])
    );

  } catch (err) {

    console.error(
      "❌ Binance Error:",
      err.response?.data || err.message
    );

    return [];
  }
}

module.exports = {
  getHistoricalPrices
};