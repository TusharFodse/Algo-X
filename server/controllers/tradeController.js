const { getBTCPrice } =
require("../services/priceService");

const {
  getFinalSignal
} = require(
  "../services/decisionService"
);

const {
  getHistoricalPrices
} = require(
  "../services/dataService"
);


// =========================
// RUN AI TRADE
// =========================

exports.runTrade =
async (req, res) => {

  try {

    const {

      symbol,

      walletAddress

    } = req.body;

    // =========================
    // LIVE PRICE
    // =========================

    const price =
      await getBTCPrice(
        symbol
      );

    if (!price || price <= 0) {

      throw new Error(
        "Invalid price data"
      );
    }

    // =========================
    // MARKET HISTORY
    // =========================

    const priceHistory =

      await getHistoricalPrices(

        symbol,

        "5m",

        100
      );

    // =========================
    // AI DECISION
    // =========================

    const result =

      await getFinalSignal(

        priceHistory,

        symbol
      );

    const signal =
      result.finalSignal;

    const confidence =
      result.confidence;

    // =========================
    // RETURN AI RESULT ONLY
    // =========================
    console.log("Signal is ",signal)

    res.json({

      walletAddress,

      symbol,

      price,

      signal,

      confidence,

      ruleSignal:
        result.ruleSignal,

      lstmSignal:
        result.lstmSignal,

      blockchainStatus:

        signal === "HOLD"

          ? "SKIPPED"

          : "WAITING_CONFIRMATION"
    });

  } catch (err) {

    console.error(

      "❌ Trade error:",

      err.message
    );

    res.status(500).json({

      error:
        "Trade execution failed",

      message:
        err.message
    });
  }
};