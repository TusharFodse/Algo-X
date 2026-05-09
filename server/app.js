const express = require("express");
const cors = require("cors");

const decision = require("./routes/decision");
const tradeRoutes = require("./routes/tradeRoute");
const backtestRoutes = require("./routes/backtestRoutes");
const marketRoutes =require("./routes/marketRoutes");
const candle =require("./routes/market_candle_Routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/market",
  marketRoutes
);
app.use("/api/ai", decision);
app.use("/api/trade", tradeRoutes);
app.use("/api/backtest", backtestRoutes);
app.use("/api/market", candle)

module.exports = app;