const express =
require("express");

const axios =
require("axios");

const router =
express.Router();

// =========================
// NORMAL LINE CHART
// =========================

router.get(
  "/chart",

  async (req, res) => {

    try {

      const {
        symbol,
        interval,
        limit
      } = req.query;

      const response =
        await axios.get(

          "https://api.binance.com/api/v3/klines",

          {
            params: {

              symbol,

              interval,

              limit
            }
          }
        );

      const formatted =

        response.data.map(
          item => ({

            time:
              item[0],

            price:
              Number(item[4])
          })
        );

      res.json(formatted);

    } catch (err) {

      console.log(err);

      res.status(500).json({

        error:
          "Failed to fetch chart"
      });
    }
  }
);

// =========================
// CANDLESTICK DATA
// =========================

router.get(
  "/candles",

  async (req, res) => {

    try {

      const {
        symbol,
        interval
      } = req.query;

      const response =
        await axios.get(

          "https://api.binance.com/api/v3/klines",

          {
            params: {

              symbol,

              interval,

              limit: 200
            }
          }
        );

      const candles =

        response.data.map(
          candle => ({

            time:
              Number(candle[0]),

            open:
              Number(candle[1]),

            high:
              Number(candle[2]),

            low:
              Number(candle[3]),

            close:
              Number(candle[4]),

            volume:
              Number(candle[5])
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
  }
);

module.exports = router;