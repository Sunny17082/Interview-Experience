const express = require("express");
const router = express.Router();
const { handlePostExperience, handleGetExperience, handleGetExperienceById, handleToggleHelpful, handlePostComment, handleReport } = require("../controllers/experience.controller");

router.post("/", handlePostExperience);
router.get("/", handleGetExperience);
router.get("/:id", handleGetExperienceById);
router.put("/:id/helpful", handleToggleHelpful);
router.post("/:id/comment", handlePostComment);
router.post("/:id/report", handleReport);



module.exports = router;