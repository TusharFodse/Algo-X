// Advanced AI Service: MA crossover + RSI + Breakout + Confidence
let buyScore = 0;
let sellScore = 0;
let reason = []; 

// 🔹 Simple Moving Average
function sma(prices, period) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
}

// 🔹 RSI (Relative Strength Index)
function calculateRSI(prices, period = 14) {
  if (!prices || prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length - 1; i++) {
    const diff = prices[i + 1] - prices[i];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return rsi;
}

// 🔹 Breakout check (recent high/low)
function breakoutSignal(prices, lookback = 10) {
  if (!prices || prices.length < lookback) return null;

  const recent = prices.slice(-lookback);
  const current = prices[prices.length - 1];

  const high = Math.max(...recent);
  const low = Math.min(...recent);

  if (current >= high) return "BREAKOUT_UP";
  if (current <= low) return "BREAKOUT_DOWN";
  return null;
}

// 🔹 Main signal function
function getSignal(prices) {
  if (!prices || prices.length < 20) {
    return { signal: "HOLD", confidence: 0, reason: "Not enough data" };
  }

  const current = prices[prices.length - 1];

  const shortMA = sma(prices, 5);
  const longMA = sma(prices, 15);
  const rsi = calculateRSI(prices);
  const breakout = breakoutSignal(prices);

  let buyScore = 0;
  let sellScore = 0;
  let reason = [];

  // Trend
  if (shortMA > longMA) {
    buyScore += 2;
    reason.push("Uptrend");
  } else {
    sellScore += 2;
    reason.push("Downtrend");
  }

  // RSI
  if (rsi < 30) {
    buyScore += 2;
    reason.push("RSI oversold");
  } else if (rsi > 70) {
    sellScore += 2;
    reason.push("RSI overbought");
  }

  // Breakout
  if (breakout === "BREAKOUT_UP") {
    buyScore += 3;
    reason.push("Breakout up");
  }
  if (breakout === "BREAKOUT_DOWN") {
    sellScore += 3;
    reason.push("Breakout down");
  }

  // Trend filter
  const trendStrength = Math.abs(shortMA - longMA) / longMA;
  if (trendStrength < 0.01) {
    return { signal: "HOLD", confidence: 0.2, reason: "Sideways market" };
  }

  
  // Final decision
  let signal = "HOLD";
  if (buyScore > sellScore && buyScore >= 3) signal = "BUY";
  if (sellScore > buyScore && sellScore >= 3) signal = "SELL";

  const total = buyScore + sellScore;
  let confidence = total > 0
    ? Math.abs(buyScore - sellScore) / total
    : 0;

  if (confidence < 0.4) signal = "HOLD";

  return {
    signal,
    confidence: Number(confidence.toFixed(3)),
    currentPrice: current,
    shortMA,
    longMA,
    rsi: Number(rsi.toFixed(2)),
    breakout,
    reason
  };
}

module.exports = { getSignal };