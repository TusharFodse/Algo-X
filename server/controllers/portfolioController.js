const Portfolio =
require("../model/Portfolio");

// 🔥 create/find portfolio
exports.syncPortfolio =
async (req, res) => {

  try {

    const {
      walletAddress
    } = req.body;

    // validation
    if (!walletAddress) {

      return res.status(400).json({

        error:
          "Wallet address required"
      });
    }

    let portfolio =
      await Portfolio.findOne({

        walletAddress
      });

    // create if missing
    if (!portfolio) {

      portfolio =
        await Portfolio.create({

          walletAddress,

          balance: 10000,

          btc: 0,

          entryPrice: null,

          lastAction: null
        });
    }

    res.json(portfolio);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        "Failed to sync portfolio"
    });
  }
};

// 🔥 get portfolio
exports.getPortfolio =
async (req, res) => {

  try {

    const {
      walletAddress
    } = req.params;

    const portfolio =
      await Portfolio.findOne({

        walletAddress
      });

    if (!portfolio) {

      return res.status(404).json({

        error:
          "Portfolio not found"
      });
    }

    res.json(portfolio);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        "Failed to fetch portfolio"
    });
  }
};