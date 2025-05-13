const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

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
	handleGetDashboardData,
	handleUpdateProfile,
	handleSendVerificationEmail,
	handleVerifyEmail,
	handleForgotPassword,
	handleResetPassword,
	handleResendVerificationEmail,
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
router.put(
	"/auth/profile/:id",
	upload.fields([
		{ name: "profileImg", maxCount: 1 },
		{ name: "coverImg", maxCount: 1 },
	]),
	handleUpdateProfile
);
router.post("/send-verification", handleSendVerificationEmail);
router.get("/verify-email/:token", handleVerifyEmail);
router.post("/resend-verification", handleResendVerificationEmail);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);

module.exports = router;
