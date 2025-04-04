const express = require("express");
const router = express.Router();

const { handlePostCompany } = require("../controllers/company.controller");

router.post("/", handlePostCompany);

module.exports = router;