const Trade =
require("../model/Trade");


// =========================
// GET HISTORY
// =========================

exports.getHistory =
async (req, res) => {

  try {

    const walletAddress =
      req.query.walletAddress;

    if (!walletAddress) {

      return res.status(400).json({

        error:
          "walletAddress required"
      });
    }

    const trades =
      await Trade.find({

        walletAddress

      })
      .sort({
        timestamp: -1
      });

    res.json(trades);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        "Failed to fetch history"
    });
  }
};


// =========================
// SAVE TRADE
// =========================

exports.saveTrade =
async (req, res) => {

  try {

    const trade =
      await Trade.create({

        walletAddress:
          req.body.walletAddress,

        action:
          req.body.action,

        symbol:
          req.body.symbol,

        price:
          req.body.price,

        confidence:
          req.body.confidence,

        txHash:
          req.body.txHash
      });

    res.json({

      success: true,

      trade
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        "Failed to save trade"
    });
  }
};