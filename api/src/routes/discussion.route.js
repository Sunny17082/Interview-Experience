const express = require("express");
const router = express.Router();

const { handlePostDiscussion, handleGetDiscussion, handleGetDiscussionById, handleToggleLike, handlePostComment } = require("../controllers/discussion.controller");

router.post("/", handlePostDiscussion);
router.get("/", handleGetDiscussion);
router.get("/:id", handleGetDiscussionById);
router.post("/:id/like", handleToggleLike);
router.post("/:id/comment", handlePostComment);




module.exports = router;