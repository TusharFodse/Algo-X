const express = require("express");

const router = express.Router();

const {
  getChartData
} = require("../controllers/marketController");

router.get(
  "/chart",
  getChartData
);

module.exports = router;