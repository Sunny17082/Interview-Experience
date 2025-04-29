const express = require("express");
const router = express.Router();

const { handlePostJobs, handleGetJobs } = require("../controllers/jobs.controller");

router.post("/", handlePostJobs);
router.get("/", handleGetJobs);

module.exports = router;