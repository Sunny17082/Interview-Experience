const express = require("express");
const router = express.Router();
const { handlePostExperience, handleGetExperience, handleGetExperienceById, handleToggleHelpful } = require("../controllers/experience.controller");

router.post("/", handlePostExperience);
router.get("/", handleGetExperience);
router.get("/:id", handleGetExperienceById);
router.put("/:id/helpful", handleToggleHelpful);

module.exports = router;