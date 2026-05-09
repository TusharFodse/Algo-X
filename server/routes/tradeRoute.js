const express = require("express");
const router = express.Router();
const { runTrade } = require("../controllers/tradeController");

router.post("/run", runTrade);

module.exports = router;