const express = require("express");
const router = express.Router();

const {
    handleLogin,
    handleRegister,
    handleGetUser,
    handleLogout
} = require("../controllers/user.controller");

router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);
router.get("/auth/getUser", handleGetUser);
router.post("/auth/logout", handleLogout);

module.exports = router;