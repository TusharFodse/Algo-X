const express = require("express");
const router = express.Router();
const { runBacktest } = require("../controllers/backtesController");

router.post("/run", runBacktest);

module.exports = router;