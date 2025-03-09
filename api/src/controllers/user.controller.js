const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;

const handleRegister = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userDoc = await User.findOne({ email });
		if (userDoc) {
			return res.status(400).json({ message: "User already exists" });
		} else {
			const hashedPassword = bcrypt.hashSync(password, 10);
			const userDoc = await User.create({
				name,
				email,
				password: hashedPassword,
			});
			return res.status(201).json({ message: "User created successfully" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
};

const handleLogin = async (req, res) => {
	const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
		const userDoc = await User.findOne({ email });
		if (!userDoc) {
			return res.status(404).json({ message: "User not found" });
		} else {
			const isPasswordValid = bcrypt.compareSync(
				password,
				userDoc.password
			);
			if (!isPasswordValid) {
				return res.status(401).json({ message: "Wrong password" });
			} else {
				const token = jwt.sign(
					{ email, name: userDoc.name, role: userDoc.role },
					jwtSecret,
					{},
					(err, token) => {
						res.cookie("token", token);
						return res.status(200).json({ message: "Login successful", token });
					}
				);
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
};

module.exports = {
	handleRegister,
	handleLogin,
};
