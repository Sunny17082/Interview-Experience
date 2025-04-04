const Experience = require("../models/experience.model");
const { verifyUserFromToken } = require("../utils/authentication");
const Company = require("../models/company.model");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const getSentimentCategory = (score) => {
	if (score > 0) return "positive";
	if (score < 0) return "negative";
	return "neutral";
};

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

		const feedbackSentiment = overallFeedback
			? sentiment.analyze(overallFeedback)
			: { score: 0, comparative: 0 };
		
		const companyDoc = await Company.findOne({ name: companyName });
		let logo =
			"https://cornellcapllc.com/wp-content/uploads/2017/08/logo-1.png";
		if (companyDoc) {
			logo = companyDoc.logo;
		}

		const experienceDoc = await Experience.create({
			user: user.id,
			name,
			logo,
			companyName,
			role,
			interviewStatus,
			packageOffered,
			challengesEncountered,
			overallFeedback,
			rounds,
			feedbackSentiment: {
				score: feedbackSentiment.score,
				comparative: feedbackSentiment.comparative,
				category: getSentimentCategory(feedbackSentiment.score),
			},
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
