const { getFinalSignal } = require("./decisionService");

async function backtest(prices) {
  let balance = 10000;
  let btc = 0;

  const FEE = 0.001;

  let trades = [];
  let peak = balance;
  let maxDrawdown = 0;

  for (let i = 20; i < prices.length; i++) {
    const slice = prices.slice(i - 20, i);

    // 🔥 Hybrid AI
    const result = await getFinalSignal(slice);

    const signal = result.finalSignal;

    // BUY
    if (signal === "BUY" && balance > 0) {
      const amount = balance * 0.5;

      const boughtBTC = (amount * (1 - FEE)) / prices[i];

      btc += boughtBTC;
      balance -= amount;

      trades.push({
        type: "BUY",
        price: prices[i],
        btc: boughtBTC,
        confidence: result.confidence
      });
    }

    // SELL
    if (signal === "SELL" && btc > 0) {
      const amountBTC = btc * 0.5;

      const sellValue = amountBTC * prices[i] * (1 - FEE);

      balance += sellValue;
      btc -= amountBTC;

      trades.push({
        type: "SELL",
        price: prices[i],
        btc: amountBTC,
        confidence: result.confidence
      });
    }

    // 📊 Portfolio tracking
    const currentValue = balance + btc * prices[i];

    if (currentValue > peak) peak = currentValue;

    const drawdown = (peak - currentValue) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const finalValue = balance + btc * prices[prices.length - 1];
  const roi = ((finalValue - 10000) / 10000) * 100;

  return {
    finalValue: Number(finalValue.toFixed(2)),
    roi: Number(roi.toFixed(2)),
    totalTrades: trades.length,
    maxDrawdown: Number((maxDrawdown * 100).toFixed(2)),
    trades
  };
}

module.exports = { backtest };