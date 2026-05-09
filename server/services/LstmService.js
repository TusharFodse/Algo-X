const axios = require("axios");

async function predictDirection(
  prices,
  symbol
) {

  try {

    const res = await axios.post(

      "http://127.0.0.1:5001/predict",

      {
        prices,
        symbol
      }
    );

    return res.data;

  } catch (err) {

    console.error(
      "❌ Python AI Error:",
      err.message
    );

    return {
      signal: "HOLD",
      confidence: 0
    };
  }
}

module.exports = {
  predictDirection
};