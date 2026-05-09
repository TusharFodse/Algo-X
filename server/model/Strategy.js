const mongoose = require("mongoose");

const StrategySchema = new mongoose.Schema({
  name: String,
  accuracy: Number,
  profit: Number
});

module.exports = mongoose.model("Strategy", StrategySchema);