// const { contract } = require("../config/blockchain");

// // optional helper for timeout
// function withTimeout(promise, ms = 60000) {
//   return Promise.race([
//     promise,
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("TX timeout")), ms)
//     )
//   ]);
// }

// async function logTrade(action, price) {
//   try {
//     console.log(`📤 Sending trade: ${action} @ ${price}`);

//     // 🔥 Estimate gas instead of hardcoding
//     const gasEstimate = await contract.addTrade.estimateGas(action, price,"Hybrid-AI");

//     const tx = await contract.addTrade(action, Math.floor(price), "Hybrid-AI",{
//       gasLimit: gasEstimate
//     },);

//     console.log("⏳ Tx sent:", tx.hash);

//     // wait for 1 confirmation (configurable)
//     const receipt = await withTimeout(tx.wait(1), 60000);

//     if (!receipt || receipt.status !== 1) {
//       throw new Error("Transaction failed or reverted");
//     }

//     console.log("✅ Confirmed:", receipt.hash);

//     return {
//       success: true,
//       hash: receipt.hash
//     };
//   } catch (err) {
//     console.error("❌ Blockchain error:", err.message);

//     // ❌ Do NOT auto-retry blindly (risk of duplicates)
//     return {
//       success: false,
//       error: err.message
//     };
//   }
// }

// module.exports = { logTrade };
const { contract } = require("../config/blockchain");

// optional helper for timeout
function withTimeout(promise, ms = 60000) {

  return Promise.race([
    promise,

    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("TX timeout")),
        ms
      )
    )
  ]);
}

async function logTrade(
  action,
  price,
  strategy,
  symbol
) {

  try {

    console.log(
      `📤 Sending trade: ${action} ${symbol} @ ${price}`
    );

    // estimate gas
    const gasEstimate =
      await contract.addTrade.estimateGas(
        action,
        Math.floor(price),
        strategy,
        symbol
      );

    // send tx
    const tx = await contract.addTrade(
      action,
      Math.floor(price),
      strategy,
      symbol,
      {
        gasLimit: gasEstimate
      }
    );

    console.log("⏳ Tx sent:", tx.hash);

    // wait confirmation
    const receipt = await withTimeout(
      tx.wait(1),
      60000
    );

    if (!receipt || receipt.status !== 1) {

      throw new Error(
        "Transaction failed or reverted"
      );
    }

    console.log(
      "✅ Confirmed:",
      receipt.hash
    );

    return {
      success: true,
      hash: receipt.hash
    };

  } catch (err) {

    console.error(
      "❌ Blockchain error:",
      err.message
    );

    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { logTrade };