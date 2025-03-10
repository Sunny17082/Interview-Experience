const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailingService");
const jwtSecret = process.env.JWT_SECRET;

const handleRegister = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userDoc = await User.findOne({ email });
		if (userDoc) {
			return res.status(400).json({ success: false, message: "User already exists" });
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
		return res.status(201).json({ success: true, message: "User created successfully" });
		}
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error", error: error.message });
	}
};

const handleLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}
		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({ success: false, message: "User not found" });
		} else {
			const isPasswordValid = bcrypt.compareSync(
				password,
				userDoc.password
			);
			if (!isPasswordValid) {
				return res.status(401).json({ success: false, message: "Wrong password" });
			} else {
				const token = jwt.sign(
					{ email, name: userDoc.name, role: userDoc.role },
					jwtSecret,
					{},
					(err, token) => {
						res.cookie("token", token);
						return res.status(200).json({ success: true, message: "Login successful", token });
					}
				);
			}
		}
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error", error: error.message });
	}
};

module.exports = {
	handleRegister,
	handleLogin,
};
