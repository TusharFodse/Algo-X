const TRADE_PERCENT = 0.3;
const STOP_LOSS = 0.03;
const TAKE_PROFIT = 0.05;
const FEE = 0.001;

async function executeTrade(portfolio, signal, price) {
  if (!portfolio.entryPrice) portfolio.entryPrice = null;
  if (!portfolio.lastAction) portfolio.lastAction = null;

  // 🔥 STOP LOSS / TAKE PROFIT
  if (portfolio.btc > 0 && portfolio.entryPrice) {
    const change = (price - portfolio.entryPrice) / portfolio.entryPrice;

    if (change <= -STOP_LOSS || change >= TAKE_PROFIT) {
      const sellValue = portfolio.btc * price * (1 - FEE);

      portfolio.balance += sellValue;
      portfolio.btc = 0;
      portfolio.entryPrice = null;
      portfolio.lastAction = change <= -STOP_LOSS ? "STOP_LOSS" : "TAKE_PROFIT";

      return portfolio;
    }
  }

  if (signal === "HOLD") return portfolio;

  // 🔹 BUY
  if (signal === "BUY" && portfolio.balance > 0) {
    if (portfolio.lastAction === "BUY") return portfolio;

    const amount = portfolio.balance * TRADE_PERCENT;
    const boughtBTC = (amount * (1 - FEE)) / price;

    const totalCost =
      (portfolio.entryPrice || 0) * portfolio.btc + amount;

    portfolio.btc += boughtBTC;
    portfolio.balance -= amount;

    portfolio.entryPrice = totalCost / portfolio.btc;
    portfolio.lastAction = "BUY";
  }

  // 🔹 SELL
  if (signal === "SELL" && portfolio.btc > 0) {
    if (portfolio.lastAction === "SELL") return portfolio;

    const amountBTC = portfolio.btc * TRADE_PERCENT;
    const sellValue = amountBTC * price * (1 - FEE);

    portfolio.balance += sellValue;
    portfolio.btc -= amountBTC;

    if (portfolio.btc < 1e-8) {
      portfolio.btc = 0;
      portfolio.entryPrice = null;
    }

    portfolio.lastAction = "SELL";
  }

  return portfolio;
}

module.exports={executeTrade}