// const { getSignal } = require("./aiService");
// const {
//   loadModel,
//   predictDirection
// } = require("./LSTMService");

// // Load model once
// let model = null;

// async function initModel() {
//   if (!model) {
//     model = await loadModel();
//     console.log("✅ LSTM Model Loaded");
//   }
// }

// // 🔥 MAIN FUNCTION
// async function getFinalSignal(prices) {
//   await initModel();

//   const rule = getSignal(prices);
//   const lstm = await predictDirection(prices, model);

//   if (!lstm) {
//     return { ...rule, source: "RULE_ONLY" };
//   }

//   let finalSignal = "HOLD";
//   let confidence = 0;

//   // 🔥 1. If both agree → strong signal
//   if (rule.signal === lstm.signal && rule.signal !== "HOLD") {
//     finalSignal = rule.signal;
//     confidence = (rule.confidence + lstm.confidence) / 2;
//   }

//   // 🔥 2. If LSTM is very confident → trust it
//   else if (lstm.confidence > 0.7) {
//     finalSignal = lstm.signal;
//     confidence = lstm.confidence;
//   }

//   // 🔥 3. Otherwise trust rule-based (more stable)
//   else if (rule.confidence > 0.5) {
//     finalSignal = rule.signal;
//     confidence = rule.confidence;
//   }

//   // 🔥 4. If weak → HOLD
//   if (confidence < 0.4) {
//     finalSignal = "HOLD";
//   }

//   return {
//     finalSignal,
//     confidence: Number(confidence.toFixed(3)),
//     ruleSignal: rule.signal,
//     lstmSignal: lstm.signal,
//     ruleConfidence: rule.confidence,
//     lstmConfidence: lstm.confidence,
//     details: rule.reason
//   };
// }

// module.exports = { getFinalSignal };
const { getSignal } = require("./aiService");

const {
  predictDirection
} = require("./LSTMService");

async function getFinalSignal(prices,symbol) {

  const rule = getSignal(prices);

  const lstm = await predictDirection(prices,symbol);

  if (!lstm) {
    return {
      ...rule,
      source: "RULE_ONLY"
    };
  }

  let finalSignal = "HOLD";
  let confidence = 0;

  // Both agree
  if (
    rule.signal === lstm.signal &&
    rule.signal !== "HOLD"
  ) {

    finalSignal = rule.signal;

    confidence =
      (rule.confidence + lstm.confidence) / 2;
  }

  // Trust strong AI
  else if (lstm.confidence > 0.7) {

    finalSignal = lstm.signal;

    confidence = lstm.confidence;
  }

  // Rule fallback
  else if (rule.confidence > 0.5) {

    finalSignal = rule.signal;

    confidence = rule.confidence;
  }

  // Weak signal
  if (confidence < 0.4) {
    finalSignal = "HOLD";
  }

  return {
    finalSignal,
    confidence: Number(confidence.toFixed(3)),
    ruleSignal: rule.signal,
    lstmSignal: lstm.signal,
    ruleConfidence: rule.confidence,
    lstmConfidence: lstm.confidence,
    details: rule.reason
  };
}

module.exports = {
  getFinalSignal
};