const Experience = require("../models/experience.model");
const { verifyUserFromToken } = require("../utils/authentication");

const handlePostExperience = async (req, res) => {
	const {
		name,
		companyName,
		role,
		interviewStatus,
		packageOffered,
		challengesEncountered,
		overallFeedback,
		rounds,
	} = req.body;
	const { token } = req.cookies;
	const user = await verifyUserFromToken(token);
	try {
		if (
			!name ||
			!companyName ||
			!role ||
			!interviewStatus ||
			!packageOffered ||
			!rounds
		) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const experienceDoc = await Experience.create({
			user: user.id,
			name,
			companyName,
			role,
			interviewStatus,
			packageOffered,
			challengesEncountered,
			overallFeedback,
			rounds,
		});
		res.status(201).json({
			success: true,
			message: "new experience created",
		});
	} catch (err) {
		console.error("Error in handlePostExperience: ", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleGetExperience = async (req, res) => {
	try {
		const experienceDoc = await Experience.find({});
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "No experience found" });
		}
		return res.status(200).json({ success: true, experienceDoc });
	} catch (err) {
		console.error("Error in handleGetExperience: ", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleGetExperienceById = async (req, res) => {
	const { id } = req.params;
	try {
		const experienceDoc = await Experience.findById(id);
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Experience not found" });
		}
		return res.status(200).json({ success: true, experienceDoc });
	} catch (err) {
		console.error("Error in handleGetExperienceById: ", err.message);
		res.status(500).json({ success: false, message: "Internal server error"});
	}
};

module.exports = {
	handlePostExperience,
    handleGetExperience,
    handleGetExperienceById,
};
