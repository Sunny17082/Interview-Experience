const Experience = require("../models/experience.model");
const { verifyUserFromToken } = require("../utils/authentication");
const Company = require("../models/company.model");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const User = require("../models/user.model");
const { sendMail } = require("../utils/mailingService");

const getSentimentCategory = (score) => {
	if (score > 1) return "positive";
	if (score < -1) return "negative";
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
		const companyDoc = await Company.findOne({
			name: { $regex: new RegExp(`^${companyName.trim()}$`, "i") },
		});
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
		const experienceDoc = await Experience.findById(id)
			.populate("user", "name email")
			.populate("comments.user", "name email");
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Experience not found" });
		}
		return res.status(200).json({ success: true, experienceDoc });
	} catch (err) {
		console.error("Error in handleGetExperienceById: ", err.message);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleToggleHelpful = async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;

	try {
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		const user = await verifyUserFromToken(token);

		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const experienceDoc = await Experience.findById(id);

		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Experience not found" });
		}

		if (!experienceDoc.helpful) {
			experienceDoc.helpful = [];
		}

		const hasMarkedHelpful = experienceDoc.helpful.includes(user.id);

		if (hasMarkedHelpful) {
			experienceDoc.helpful = experienceDoc.helpful.filter(
				(userId) => userId.toString() !== user.id.toString()
			);
		} else {
			experienceDoc.helpful.push(user.id);
		}
		await experienceDoc.save();
		return res.status(200).json({
			success: true,
			message: hasMarkedHelpful
				? "Removed from helpful"
				: "Marked as helpful",
			experienceDoc,
		});
	} catch (err) {
		console.error("Error in toggleHelpful: ", err.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const handlePostComment = async (req, res) => {
	const { comment } = req.body;
	const { id } = req.params;
	const { token } = req.cookies;
	// Verify user from token
	try {
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		const experienceDoc = await Experience.findById(id);
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "experience not found" });
		}
		if (!comment) {
			return res
				.status(400)
				.json({ success: false, message: "Missing required fields" });
		}
		if (!experienceDoc.comments) {
			experienceDoc.comments = [];
		}
		experienceDoc.comments.push({
			content: comment,
			user: user.id,
			createdAt: new Date(),
		});
		await experienceDoc.save();
		sendMail(
			user.name,
			user.email,
			"Somone commented on your experience",
			`Your experience for ${experienceDoc.companyName} has a new comment`,
			"View Experience",
			`${process.env.FRONTEND_URL}/experience/${experienceDoc._id}`
		);
		return res.status(201).json({
			success: true,
			message: "Comment added successfully",
			experienceDoc,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

const handleReport = async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;
	const { reason } = req.body;

	try {
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const user = await verifyUserFromToken(token);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const experienceDoc = await Experience.findById(id);
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Experience not found" });
		}

		// Check if this user has already reported this experience
		if (!experienceDoc.reporters) {
			experienceDoc.reporters = [];
		}

		if (experienceDoc.reporters.includes(user.id)) {
			return res.status(400).json({
				success: false,
				message: "You have already reported this experience",
			});
		}

		// Add user to reporters list
		experienceDoc.reporters.push(user.id);

		// Increment report count
		experienceDoc.report += 1;

		// If report count reaches 3, send email to author and set deletion date
		if (experienceDoc.report === 3) {
			const author = await User.findById(experienceDoc.user);
			if (author && author.email) {
				const subject = "Your post has been reported multiple times";
				const content = `Your interview experience for ${experienceDoc.companyName} (${experienceDoc.role}) has been reported by multiple users.
        		Please review and update your post within 24 hours or it will be automatically removed.`;
				const cta = "Review Post";
				const link = `${process.env.FRONTEND_URL}/experience/${experienceDoc._id}`;

				sendMail(
					author.name,
					author.email,
					subject,
					content,
					cta,
					link
				);

				// Set scheduled deletion date
				experienceDoc.scheduledForDeletion = new Date(
					Date.now() + 60 * 1000 * 60 * 24
				);

				// Record the time of reporting
				experienceDoc.reportedAt = new Date();

				// Initialize contentUpdatedAt as null (not updated yet)
				experienceDoc.contentUpdatedAt = null;
			}
		}

		await experienceDoc.save();

		return res.status(200).json({
			success: true,
			message: "Experience reported successfully",
		});
	} catch (err) {
		console.error("Error in handleReport:", err.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const handleUpdateExperience = async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;
	const updateData = req.body;

	try {
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const experienceDoc = await Experience.findById(id);
		if (!experienceDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Experience not found" });
		}

		// Check if this user is the author
		if (experienceDoc.user.toString() !== user.id.toString()) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to update this experience",
			});
		}

		// Check if there are actual content changes (not just adding comments)
		const contentChanged =
			updateData.overallFeedback !== undefined ||
			updateData.challengesEncountered !== undefined ||
			updateData.rounds !== undefined ||
			updateData.role !== undefined ||
			updateData.packageOffered !== undefined ||
			updateData.interviewStatus !== undefined;

		// Update the experience with new data
		Object.keys(updateData).forEach((key) => {
			if (
				key !== "user" &&
				key !== "_id" &&
				key !== "report" &&
				key !== "reporters" &&
				key !== "reportedAt" &&
				key !== "contentUpdatedAt" &&
				key !== "scheduledForDeletion"
			) {
				experienceDoc[key] = updateData[key];
			}
		});

		// Update sentiment analysis if overallFeedback was changed
		if (updateData.overallFeedback) {
			const feedbackSentiment = sentiment.analyze(
				updateData.overallFeedback
			);
			experienceDoc.feedbackSentiment = {
				score: feedbackSentiment.score,
				comparative: feedbackSentiment.comparative,
				category: getSentimentCategory(feedbackSentiment.score),
			};
		}

		// If this was a content update (not just comments) and experience is reported
		if (
			contentChanged &&
			experienceDoc.reportedAt &&
			experienceDoc.scheduledForDeletion
		) {
			// Set content update timestamp
			experienceDoc.contentUpdatedAt = new Date();

			// Notify author that their post has been saved from deletion
			const author = await User.findById(experienceDoc.user);
			if (author && author.email) {
				const subject = "Your reported post has been saved";
				const content = `Thank you for updating your interview experience for ${experienceDoc.companyName}. 
        The changes you made have addressed the reports, and your post will no longer be removed.`;
				const cta = "View Your Post";
				const link = `${process.env.FRONTEND_URL}/experience/${experienceDoc._id}`;

				sendMail(
					author.name,
					author.email,
					subject,
					content,
					cta,
					link
				);
			}
		}

		await experienceDoc.save();

		return res.status(200).json({
			success: true,
			message: "Experience updated successfully",
			experienceDoc,
		});
	} catch (err) {
		console.error("Error in handleUpdateExperience:", err.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const handleGetExperienceByLimit = async (req, res) => {
	const { limit } = req.query;
	try {
		const experienceDoc = await Experience.find({}).sort({ createdAt: -1 }).limit(3);
		if (!experienceDoc || experienceDoc.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: "No experience found" });
		}
		return res.status(200).json({ success: true, experienceDoc });
	} catch (err) {
		console.error("Error in handleGetExperienceByLimit: ", err);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleDeleteExperience = async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;

	try {
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		const user = verifyUserFromToken(token);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		await Experience.findByIdAndDelete(id);
		return res.status(200).json({
			success: true,
			message: "Experience deleted successfully",
		});
	} catch (err) {
		console.error("Error in handleDeleteExperience:", err.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

module.exports = {
	handlePostExperience,
	handleGetExperience,
	handleGetExperienceById,
	handleUpdateExperience,
	handleDeleteExperience,
	handleGetExperienceByLimit,
	handleToggleHelpful,
	handlePostComment,
	handleReport,
};
