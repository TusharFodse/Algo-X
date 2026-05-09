const { backtest } = require("../services/backtest");
// import { backtest } from "../services/backtest";
exports.runBacktest = async (req, res) => {
  try {
    const prices = req.body.prices;

    if (!prices || prices.length < 20) {
      return res.status(400).json({
        error: "Need at least 20 data points"
      });
    }

    const result = await backtest(prices);

    res.json({
      success: true,
      ...result
    });

  } catch (err) {
    res.status(500).json({
      error: "Backtest failed",
      message: err.message
    });
  }
};