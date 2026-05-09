const axios =
require("axios");

exports.getCandles =
async (req, res) => {

  try {

    const symbol =
      req.query.symbol
      || "BTCUSDT";

    const interval =
      req.query.interval
      || "5m";

    const response =
      await axios.get(

        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
      );

    const candles =

      response.data.map(
        candle => ({

          time:
            candle[0],

          open:
            parseFloat(candle[1]),

          high:
            parseFloat(candle[2]),

          low:
            parseFloat(candle[3]),

          close:
            parseFloat(candle[4]),

          volume:
            parseFloat(candle[5])
        })
      );

    res.json(candles);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        "Failed to fetch candles"
    });
  }
};