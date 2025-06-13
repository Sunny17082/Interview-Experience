const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail, sendBulkMail } = require("../utils/mailingService");
const jwtSecret = process.env.JWT_SECRET;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { body, validationResult } = require("express-validator");
const Discussion = require("../models/discussion.model");
const Resource = require("../models/resource.model");
const Experience = require("../models/experience.model");
const Jobs = require("../models/jobs.model");
const Company = require("../models/company.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const crypto = require("crypto");
const connectDB = require("../db/connection");

const generateToken = () => {
	return crypto.randomBytes(32).toString("hex");
};

const TRUSTED_DOMAINS = [
	"gmail.com",
	"outlook.com",
	"hotmail.com",
	"yahoo.com",
	"ticollege.org",
];

// Validation middleware
const registerValidation = [
	// Name validation
	body("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters")
		.trim(),

	// Email validation
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please provide a valid email")
		.custom((value) => {
			// Extract domain from email
			const domain = value.split("@")[1].toLowerCase();

			// Check if domain is in trusted domains list
			if (!TRUSTED_DOMAINS.includes(domain)) {
				throw new Error(
					"Email domain not allowed. Please use an email from a trusted domain."
				);
			}

			return true;
		})
		.normalizeEmail(),

	// Password validation
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters")
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
		),
];

const handleRegister = async (req, res) => {
	await Promise.all(
		registerValidation.map((validation) => validation.run(req))
	);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: errors.array(),
		});
	}

	connectDB();

	const { name, email, password } = req.body;
	try {
		const userDoc = await User.findOne({ email });
		if (userDoc) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		} else {
			const hashedPassword = bcrypt.hashSync(password, 10);

			// Generate verification token
			const verificationToken = crypto.randomBytes(32).toString("hex");
			const verificationExpiry = new Date();
			verificationExpiry.setHours(verificationExpiry.getHours() + 24); // Token valid for 24 hours

			const userDoc = await User.create({
				name,
				email,
				password: hashedPassword,
				verificationToken,
				verificationExpiry,
			});

			// Create verification link
			const verificationLink = `${process.env.CLIENT_URL}/verifyemail/${verificationToken}`;

			// Send welcome email with verification link
			sendMail(
				name,
				email,
				"Welcome to InterviewInsights",
				`Thank you for signing up! Your account is now ready to use. <br/>Please verify your email to access all features of InterviewInsights.`,
				"Verify Email",
				verificationLink
			);

			return res.status(201).json({
				success: true,
				message:
					"User created successfully. Please check your email to verify your account.",
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const handleLogin = async (req, res) => {
	connectDB();
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				path: "email",
				message: "Email and password are required",
			});
		}
		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({
				success: false,
				path: "email",
				message: "User not found",
			});
		} else {
			const isPasswordValid = bcrypt.compareSync(
				password,
				userDoc.password
			);
			if (!isPasswordValid) {
				return res.status(401).json({
					success: false,
					path: "password",
					message: "Wrong password",
				});
			} else {
				const token = jwt.sign(
					{
						id: userDoc._id,
						email,
						name: userDoc.name,
						role: userDoc.role,
						isVerified: userDoc.isVerified,
					},
					jwtSecret,
					{},
					(err, token) => {
						res.cookie("token", token, {
							httpOnly: true,
							maxAge: 7 * 24 * 60 * 60 * 1000,
							sameSite: "strict",
						});
						return res.status(200).json({
							success: true,
							message: "Login successful",
							userData: {
								id: userDoc.id,
								name: userDoc.name,
								email: userDoc.email,
								role: userDoc.role,
								isVerified: userDoc.isVerified,
							},
							token,
						});
					}
				);
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				connectDB();
				// First check if user exists with this Google ID
				let user = await User.findOne({ googleId: profile.id });

				// If no user found with Google ID, check by email
				if (!user) {
					const email = profile.emails[0].value;
					const existingUser = await User.findOne({ email: email });

					if (existingUser) {
						// User exists but doesn't have Google authentication
						// Update the existing user with Google information
						existingUser.googleId = profile.id;
						existingUser.isVerified = true;
						existingUser.profileImg = profile.photos[0].value;
						// You might want to update other fields too
						await existingUser.save();
						return done(null, existingUser);
					} else {
						// Create new user if no existing account found
						user = await User.create({
							googleId: profile.id,
							name: profile.displayName,
							profileImg: profile.photos[0].value,
							email: email,
							isVerified: true,
						});
					}
				}
				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);

const handleGoogleLogin = passport.authenticate("google", {
	scope: ["profile", "email"],
	prompt: "select_account",
});

const handleGoogleCallback = (req, res, next) => {
	
	passport.authenticate("google", { session: false }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({ error: err });
		}

		const token = jwt.sign(
			{
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
			},
			jwtSecret,
			{}
		);

		res.cookie("token", token, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
		}).redirect(process.env.CLIENT_URL);
	})(req, res, next);
};

const handleGetUser = (req, res) => {
	connectDB();
	const { token } = req.cookies;
	try {
		if (!token || token === "") {
			return res.json({ success: false, message: "Unauthorized" });
		}
		const user = jwt.verify(token, jwtSecret);
		return res.status(200).json({ success: true, user });
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

const handleGetUserById = async (req, res) => {
	connectDB();
	const { id } = req.params;

	try {
		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "ID is required" });
		}
		const userDoc = await User.findById(id).select("-password -__v");
		const discussionDoc = await Discussion.find({ user: id }).select(
			"title _id"
		);
		const resourceDoc = await Resource.find({ user: id }).select(
			"title _id"
		);
		const experienceDoc = await Experience.find({ user: id }).select(
			"companyName _id"
		);
		if (!userDoc) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		return res.status(200).json({
			success: true,
			data: {
				userDoc,
				discussionDoc,
				resourceDoc,
				experienceDoc,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const handleGetAllUser = async (req, res) => {
	connectDB();
	try {
		const userDoc = await User.find({}).select("-password -__v");
		if (!userDoc) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		return res.status(200).json({
			success: true,
			data: userDoc,
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

const handleRoleChange = async (req, res) => {
	connectDB();
	const { id } = req.params;
	const { role } = req.body;
	try {
		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "ID is required" });
		}
		if (!role) {
			return res
				.status(400)
				.json({ success: false, message: "Role is required" });
		}
		const userDoc = await User.findByIdAndUpdate(
			id,
			{ role },
			{ new: true }
		).select("-password -__v");
		if (!userDoc) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}
		sendMail(
			userDoc.name,
			userDoc.email,
			"Role updated",
			`Your role has been updated to ${role}`,
			"view profile",
			`http://localhost:5173/profile/${userDoc._id}`
		);
		return res.status(200).json({
			success: true,
			data: userDoc,
			message: "Role updated successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const handleBulkEmail = async (req, res) => {
	connectDB();
	try {
		const { userIds, subject, content, cta, link } = req.body;

		if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: "User IDs are required and must be an array",
			});
		}

		if (!subject || !content) {
			return res.status(400).json({
				success: false,
				message: "Subject and content are required",
			});
		}

		// Get user details from database
		const users = await User.find({ _id: { $in: userIds } }).select(
			"name email"
		);

		if (users.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No valid users found",
			});
		}

		// Format recipients for email service
		const recipients = users.map((user) => ({
			name: user.name,
			email: user.email,
		}));

		// Send emails
		await sendBulkMail(
			recipients,
			subject,
			content,
			cta || "view",
			link || "http://localhost:5173"
		);

		return res.status(200).json({
			success: true,
			message: `Emails sent successfully to ${users.length} users`,
		});
	} catch (error) {
		console.error("Error sending bulk emails:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const handleGetDashboardData = async (req, res) => {
	connectDB();
	try {
		const userCount = await User.countDocuments({});
		const discussionCount = await Discussion.countDocuments({});
		const resourceCount = await Resource.countDocuments({});
		const experienceCount = await Experience.countDocuments({});
		const jobCount = await Jobs.countDocuments({});
		const companyCount = await Company.countDocuments({});

		return res.status(200).json({
			success: true,
			data: {
				discussions: discussionCount,
				resources: resourceCount,
				experiences: experienceCount,
				jobs: jobCount,
				companies: companyCount,
				users: userCount,
			},
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: err.message,
		});
	}
};

const handleUpdateProfile = async (req, res) => {
	connectDB();
	const { id } = req.params;
	try {
		// Check if user exists
		const userDoc = await User.findById(id);
		if (!userDoc) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Update user fields if provided in request body
		const updatableFields = ["name", "cId"];
		const updates = {};

		updatableFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				updates[field] = req.body[field];
			}
		});

		// Handle profile image upload if file exists
		if (req.files && req.files.profileImg) {
			const profileImgResult = await uploadOnCloudinary(
				req.files.profileImg[0].path
			);
			if (profileImgResult) {
				updates.profileImg = profileImgResult.secure_url;
			}
		}

		// Handle cover image upload if file exists
		if (req.files && req.files.coverImg) {
			const coverImgResult = await uploadOnCloudinary(
				req.files.coverImg[0].path
			);
			if (coverImgResult) {
				updates.coverImg = coverImgResult.secure_url;
			}
		}

		// Update the user document
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true }
		).select("-password -__v");

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const handleLogout = (req, res) => {
	res.clearCookie("token");
	return res
		.status(200)
		.json({ success: true, message: "Logged out successfully" });
};

// Handle sending verification email
const handleSendVerificationEmail = async (req, res) => {
	connectDB();
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (userDoc.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email is already verified",
			});
		}

		// Generate verification token
		const verificationToken = generateToken();
		const verificationExpiry = new Date();
		verificationExpiry.setHours(verificationExpiry.getHours() + 24); // Token valid for 24 hours

		// Save token to user document
		userDoc.verificationToken = verificationToken;
		userDoc.verificationExpiry = verificationExpiry;
		await userDoc.save();

		// Create verification link
		const verificationLink = `${process.env.CLIENT_URL}/verifyemail/${verificationToken}`;

		// Send verification email
		sendMail(
			userDoc.name,
			userDoc.email,
			"Verify Your Email for InterviewInsights",
			`Please verify your email address to access all features of InterviewInsights. This link will expire in 24 hours.`,
			"Verify Email",
			verificationLink
		);

		return res.status(200).json({
			success: true,
			message: "Verification email sent successfully",
		});
	} catch (error) {
		console.error("Error sending verification email:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

// Handle verifying email token
const handleVerifyEmail = async (req, res) => {
	connectDB();
	try {
		const { token } = req.params;

		if (!token) {
			return res.status(400).json({
				success: false,
				message: "Verification token is required",
			});
		}

		const userDoc = await User.findOne({
			verificationToken: token,
			verificationExpiry: { $gt: new Date() },
		});

		if (!userDoc) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired verification token",
			});
		}

		// Update user document
		userDoc.isVerified = true;
		userDoc.verificationToken = undefined;
		userDoc.verificationExpiry = undefined;
		await userDoc.save();

		// Send confirmation email
		sendMail(
			userDoc.name,
			userDoc.email,
			"Your Email Has Been Verified",
			`Congratulations! Your email has been successfully verified. You now have full access to all features of InterviewInsights.`,
			"Go to InterviewInsights",
			`${process.env.CLIENT_URL}`
		);

		return res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error) {
		console.error("Error verifying email:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

// Request password reset
const handleForgotPassword = async (req, res) => {
	connectDB();
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Generate reset token
		const resetToken = generateToken();
		const resetExpiry = new Date();
		resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valid for 1 hour

		// Save token to user document
		userDoc.resetPasswordToken = resetToken;
		userDoc.resetPasswordExpiry = resetExpiry;
		await userDoc.save();

		// Create reset link
		const resetLink = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

		// Send password reset email
		await sendMail(
			userDoc.name,
			userDoc.email,
			"Reset Your InterviewInsights Password",
			`You requested to reset your password. Please click the button below to set a new password. This link will expire in 1 hour.`,
			"Reset Password",
			resetLink
		);

		return res.status(200).json({
			success: true,
			message: "Password reset link sent to your email",
		});
	} catch (error) {
		console.error("Error handling forgot password:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

// Reset password with token
const handleResetPassword = async (req, res) => {
	connectDB();
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!token) {
			return res.status(400).json({
				success: false,
				message: "Reset token is required",
			});
		}

		if (!password) {
			return res.status(400).json({
				success: false,
				message: "New password is required",
			});
		}

		// Password validation
		if (password.length < 8) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 8 characters",
			});
		}

		if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			});
		}

		const userDoc = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiry: { $gt: new Date() },
		});

		if (!userDoc) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset token",
			});
		}

		// Update password
		const hashedPassword = bcrypt.hashSync(password, 10);
		userDoc.password = hashedPassword;
		userDoc.resetPasswordToken = undefined;
		userDoc.resetPasswordExpiry = undefined;
		await userDoc.save();

		// Send confirmation email
		await sendMail(
			userDoc.name,
			userDoc.email,
			"Your Password Has Been Reset",
			`Your password has been successfully reset. If you did not request this change, please contact support immediately.`,
			"Login",
			`${process.env.CLIENT_URL}/login`
		);

		return res.status(200).json({
			success: true,
			message: "Password reset successfully",
		});
	} catch (error) {
		console.error("Error resetting password:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

// Resend verification email
const handleResendVerificationEmail = async (req, res) => {
	connectDB();
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (userDoc.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email is already verified",
			});
		}

		// Generate new verification token
		const verificationToken = generateToken();
		const verificationExpiry = new Date();
		verificationExpiry.setHours(verificationExpiry.getHours() + 24); // Token valid for 24 hours

		// Save token to user document
		userDoc.verificationToken = verificationToken;
		userDoc.verificationExpiry = verificationExpiry;
		await userDoc.save();

		// Create verification link
		const verificationLink = `${process.env.CLIENT_URL}/verifyemail/${verificationToken}`;

		// Send verification email
		sendMail(
			userDoc.name,
			userDoc.email,
			"Verify Your Email for InterviewInsights",
			`Please verify your email address to access all features of InterviewInsights. This link will expire in 24 hours.`,
			"Verify Email",
			verificationLink
		);

		return res.status(200).json({
			success: true,
			message: "Verification email resent successfully",
		});
	} catch (error) {
		console.error("Error resending verification email:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports = {
	handleRegister,
	handleLogin,
	handleGetUser,
	handleLogout,
	handleGoogleLogin,
	handleGoogleCallback,
	handleGoogleLogin,
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
};
