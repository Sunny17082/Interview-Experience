const express = require("express");
const router = express.Router();

const {
    handleLogin,
    handleRegister,
    handleGetUser,
    handleLogout,
    handleGoogleLogin,
    handleGoogleCallback,
    handleGetUserById,
    handleGetAllUser,
    handleRoleChange,
    handleBulkEmail,
    handleGetDashboardData
} = require("../controllers/user.controller");

router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);
router.get("/auth/getUser", handleGetUser);
router.post("/auth/logout", handleLogout);
router.get("/auth/google", handleGoogleLogin);
router.get("/auth/google/callback", handleGoogleCallback);
router.get("/auth/profile/:id", handleGetUserById);
router.get("/auth/getAllUser", handleGetAllUser);
router.post("/auth/role/:id", handleRoleChange);
router.post("/auth/bulkEmail", handleBulkEmail);
router.get("/auth/dashboard", handleGetDashboardData);  

module.exports = router;