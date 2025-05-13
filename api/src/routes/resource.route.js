const express = require('express');
const router = express.Router();
const { handlePostResource, handleGetResource, handleToggleLike, handleToggleDislike } = require("../controllers/resource.controller");

router.post('/', handlePostResource);
router.get('/', handleGetResource);
router.post("/:id/like", handleToggleLike);
router.post("/:id/dislike", handleToggleDislike);


module.exports = router;