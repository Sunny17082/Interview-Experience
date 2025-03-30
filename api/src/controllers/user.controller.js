const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailingService");
const jwtSecret = process.env.JWT_SECRET;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const handleRegister = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userDoc = await User.findOne({ email });
		if (userDoc) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		} else {
			const hashedPassword = bcrypt.hashSync(password, 10);
			const userDoc = await User.create({
				name,
				email,
				password: hashedPassword,
			});
			sendMail(
				name,
				email,
				"Welcome to InterviewInsights",
				`Thank you for signing up! Your account is now ready to use. <br/>Please verify your email to access all features of InterviewInsights.`,
				"verify email",
				"www.google.com"
			);
			return res
				.status(201)
				.json({ success: true, message: "User created successfully" });
		}
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({
				success: false,
				message: "Internal Server Error",
				error: error.message,
			});
	}
};

const handleLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Email and password are required",
				});
		}
		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		} else {
			const isPasswordValid = bcrypt.compareSync(
				password,
				userDoc.password
			);
			if (!isPasswordValid) {
				return res
					.status(401)
					.json({ success: false, message: "Wrong password" });
			} else {
				const token = jwt.sign(
					{ id: userDoc._id, email, name: userDoc.name, role: userDoc.role },
					jwtSecret,
					{},
					(err, token) => {
						res.cookie("token", token, {
							httpOnly: true,
							maxAge: 7 * 24 * 60 * 60 * 1000,
							sameSite: "strict",	
						});
						return res
							.status(200)
							.json({
								success: true,
								message: "Login successful",
								userData: {
									id: userDoc.id,
									name: userDoc.name,
									email: userDoc.email,
									role: userDoc.role,
								},
								token,
							});
					}
				);
			}
		}
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({
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
	const { token } = req.cookies;
	try {
		if (!token || token === "") {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		const user = jwt.verify(token, jwtSecret);
		return res.status(200).json({ success: true, user });
	} catch (err) {
		console.error(err.message);
		return res
			.status(500)
			.json({
				success: false,
				message: "Internal Server Error",
				error: err.message,
			});
	}
};

const handleLogout = (req, res) => {
	res.clearCookie("token");
	return res
		.status(200)
		.json({ success: true, message: "Logged out successfully" });
};

module.exports = {
	handleRegister,
	handleLogin,
	handleGetUser,
	handleLogout,
	handleGoogleLogin,
	handleGoogleCallback,
	handleGoogleLogin,
};
