const express = require("express");
const router = express.Router();
const { handlePostExperience, handleGetExperience, handleGetExperienceById, handleToggleHelpful, handleUpdateExperience, handleDeleteExperience, handlePostComment, handleReport, handleGetExperienceByLimit } = require("../controllers/experience.controller");

router.post("/", handlePostExperience);
router.get("/", handleGetExperience);
router.get("/:id", handleGetExperienceById);
router.put("/:id/helpful", handleToggleHelpful);
router.post("/:id/comment", handlePostComment);
router.post("/:id/report", handleReport);
router.put("/:id", handleUpdateExperience);
router.delete("/:id", handleDeleteExperience);
router.get("/limit/:limit", handleGetExperienceByLimit);

module.exports = router;