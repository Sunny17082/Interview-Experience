const express = require("express");
const router = express.Router();
const { handlePostExperience, handleGetExperience, handleGetExperienceById, handleToggleHelpful, handleUpdateExperience, handleDeleteExperience, handlePostComment, handleReport, handleGetExperienceByLimit, handleGetReportedExperiences, handleListExperience } = require("../controllers/experience.controller");

router.get("/reported", handleGetReportedExperiences);
router.post("/", handlePostExperience);
router.get("/", handleGetExperience);
router.get("/:id", handleGetExperienceById);
router.put("/:id/helpful", handleToggleHelpful);
router.post("/:id/comment", handlePostComment);
router.post("/:id/report", handleReport);
router.put("/:id", handleUpdateExperience);
router.delete("/:id", handleDeleteExperience);
router.get("/limit/:limit", handleGetExperienceByLimit);
router.post("/list/:id", handleListExperience);

module.exports = router;