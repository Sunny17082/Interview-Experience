const express = require("express");
const router = express.Router();

const {
    handleLogin,
    handleRegister
} = require("../controllers/user.controller");

router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);



module.exports = router;