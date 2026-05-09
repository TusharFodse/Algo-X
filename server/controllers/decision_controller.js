const { getFinalSignal } = require("../services/decisionService");
// import { getFinalSignal } from "../services/decisionService";
exports.predict = async (req, res) => {
  try {
    const prices = req.body.prices;

    // 🔥 validation
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

    // 🧠 hybrid AI
    const result = await getFinalSignal(prices);

    res.json({
      success: true,
      dataPoints: prices.length,
      model: "Hybrid-AI",
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