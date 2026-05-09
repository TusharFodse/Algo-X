const { getFinalSignal } = require("../services/decisionService");

exports.predict = async (req, res) => {
  try {
    const prices = req.body.prices;

    if (!prices || !Array.isArray(prices) || prices.length < 20) {
      return res.status(400).json({
        error: "At least 20 price points required"
      });
    }

    const isValid = prices.every(p => typeof p === "number" && p > 0);
    if (!isValid) {
      return res.status(400).json({
        error: "Invalid price values"
      });
    }

    const start = Date.now();
    const result = await getFinalSignal(prices);
    const time = Date.now() - start;

    res.json({
      success: true,
      model: "Hybrid-AI",
      modelVersion: "v1.0",
      dataPoints: prices.length,
      executionTime: `${time}ms`,
      explanation: result.details,
      ...result
    });

  } catch (err) {
    console.error("❌ AI error:", err.message);

    res.status(500).json({
      error: "AI prediction failed",
      message: err.message
    });
  }
};