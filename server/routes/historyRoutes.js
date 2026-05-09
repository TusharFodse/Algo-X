const express = require("express");

const router = express.Router();

const {
  getHistory,
  saveTrade
} = require("../controllers/historyController");

router.get("/", getHistory);
router.post(
  "/save",
  saveTrade
);

module.exports = router;