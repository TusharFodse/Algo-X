const express =
require("express");

const router =
express.Router();

const {
  finetuneModel
} = require(
  "../controllers/modelController"
);

router.post(
  "/finetune",
  finetuneModel
);

module.exports = router;