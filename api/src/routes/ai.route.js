const express = require("express");
const router = express.Router();

const { handleGetSummary, handleGetAnswer } = require("../controllers/ai.controller");

router.post("/summary", handleGetSummary);
router.post("/answer", handleGetAnswer);

module.exports = router;