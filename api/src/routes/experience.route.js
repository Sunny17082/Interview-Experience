const express = require("express");
const router = express.Router();

const { handlePostExperience, handleGetExperience, handleGetExperienceById } = require("../controllers/experience.controller");

router.post("/", handlePostExperience);
router.get("/", handleGetExperience);
router.get("/:id", handleGetExperienceById);

module.exports = router;