const mongoose =
require("mongoose");

const TradeSchema =
new mongoose.Schema({

  walletAddress: {
    type: String,
    required: true
  },

  action: String,

  symbol: String,

  price: Number,

  balance: Number,

  strategy: String,

  confidence: Number,

  txHash: String,

  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.model(
  "Trade",
  TradeSchema
);