const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },

  balance: {
    type: Number,
    default: 10000
  },

  btc: {
    type: Number,
    default: 0
  },

  entryPrice: {
    type: Number,
    default: null
  },

  lastAction: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);