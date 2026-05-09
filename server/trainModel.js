// const { getHistoricalPrices } = require("./services/dataService");
// // const { trainModel } = require("./services/LSTMService");

// async function main() {
//   try {
//     console.log("📥 Fetching historical data...");

//     // 🔥 Get large dataset
//     const prices = await getHistoricalPrices("BTCUSDT", 1000);

//     console.log("📊 Data points:", prices.length);

//     // 🔥 Train model
//     // await trainModel(prices);

//     console.log("✅ Training completed!");
//     process.exit(0);

//   } catch (err) {
//     console.error("❌ Training failed:", err.message);
//     process.exit(1);
//   }
// }

// main();