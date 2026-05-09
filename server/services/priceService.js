const axios = require("axios");

async function getBTCPrice(symbol = "BTCUSDT") {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    return parseFloat(res.data.price);
  } catch (err) {
    console.error("Error fetching price:", err.message);
    return null;
  }
}

module.exports = { getBTCPrice };