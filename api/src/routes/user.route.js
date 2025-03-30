const express = require("express");
const router = express.Router();

const {
    handleLogin,
    handleRegister,
    handleGetUser,
    handleLogout,
    handleGoogleLogin,
    handleGoogleCallback,
} = require("../controllers/user.controller");

router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);
router.get("/auth/getUser", handleGetUser);
router.post("/auth/logout", handleLogout);
router.get("/auth/google", handleGoogleLogin);
router.get("/auth/google/callback", handleGoogleCallback);

module.exports = router;