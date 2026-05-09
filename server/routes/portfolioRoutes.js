const express =
require("express");

const router =
express.Router();

const {

  syncPortfolio,

  getPortfolio

} = require(

  "../controllers/portfolioController"
);

// create/find
router.post(
  "/sync",
  syncPortfolio
);

// get portfolio
router.get(
  "/:walletAddress",
  getPortfolio
);

module.exports =router;