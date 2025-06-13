const Experience = require("../models/experience.model");
const { verifyUserFromToken } = require("../utils/authentication");
const Company = require("../models/company.model");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const User = require("../models/user.model");
const { sendMail } = require("../utils/mailingService");
const { connectDB } = require("../db/connection");


const getSentimentCategory = (score) => {
	if (score > 1) return "positive";
	if (score < -1) return "negative";
	return "neutral";
};

const handlePostExperience = async (req, res) => {
	connectDB();
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
	connectDB();
	try {
		// Only get experiences that are not unlisted
		const experienceDoc = await Experience.find({
			unlisted: { $ne: true },
		}).select(
			"name companyName role interviewStatus packageOffered rounds logo"
		);
		if (!experienceDoc || experienceDoc.length === 0) {
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
	connectDB();
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
	connectDB();
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
	connectDB();
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

		// Get the experience author to send notification
		const experienceAuthor = await User.findById(experienceDoc.user);
		if (
			experienceAuthor &&
			experienceAuthor.email &&
			experienceAuthor._id.toString() !== user._id.toString()
		) {
			sendMail(
				experienceAuthor.name,
				experienceAuthor.email,
				"Someone commented on your experience",
				`Your experience for ${experienceDoc.companyName} has a new comment from ${user.name}`,
				"View Experience",
				`${process.env.FRONTEND_URL}/experience/${experienceDoc._id}`
			);
		}

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
	connectDB();
	const { id } = req.params;
	const { token } = req.cookies;
	const { reason, details } = req.body;

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

		// Validate reason
		const validReasons = [
			"spam",
			"inappropriate_content",
			"offensive_language",
			"misleading_information",
			"privacy_violation",
			"duplicate_content",
			"other",
		];

		if (!reason || !validReasons.includes(reason)) {
			return res.status(400).json({
				success: false,
				message: "Invalid or missing report reason",
			});
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

		const hasReported = experienceDoc.reporters.some(
			(reporter) =>
				reporter.user && reporter.user.toString() === user.id.toString()
		);

		if (hasReported) {
			return res.status(400).json({
				success: false,
				message: "You have already reported this experience",
			});
		}

		// Add user to reporters list with reason and details
		experienceDoc.reporters.push({
			user: user.id,
			reason: reason,
			details: details || "",
			reportedAt: new Date(),
		});

		// Increment report count
		experienceDoc.report += 1;

		// If report count reaches 3, unlist the experience and send email to author
		if (experienceDoc.report >= 3) {
			const author = await User.findById(experienceDoc.user);

			// Unlist the experience immediately
			experienceDoc.unlisted = true;
			experienceDoc.reportedAt = new Date();
			experienceDoc.scheduledForDeletion = new Date(
				Date.now() + 60 * 1000 * 60 * 24
			); // 24 hours
			experienceDoc.contentUpdatedAt = null;

			if (author && author.email) {
				// Generate report reasons summary for email
				const reportReasons = experienceDoc.reporters
					.map((reporter) => {
						const reasonLabels = {
							spam: "Spam",
							inappropriate_content: "Inappropriate Content",
							offensive_language: "Offensive Language",
							misleading_information: "Misleading Information",
							privacy_violation: "Privacy Violation",
							duplicate_content: "Duplicate Content",
							other: "Other",
						};

						return `• ${
							reasonLabels[reporter.reason] || reporter.reason
						}${reporter.details ? `: ${reporter.details}` : ""}`;
					})
					.join("\n");

				const subject = "Your post has been unlisted due to reports";
				const content = `Your interview experience for ${experienceDoc.companyName} (${experienceDoc.role}) has been reported by multiple users and has been temporarily unlisted.</br>

								The following issues were reported:</br>
								${reportReasons}</br>

								Please review and update your post within 24 hours to address these concerns and get it relisted, or it will be permanently removed.

								If you believe these reports are unfounded, please contact our support team.`;

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
			}
		}

		await experienceDoc.save();

		// Get reason label for response
		const reasonLabels = {
			spam: "Spam",
			inappropriate_content: "Inappropriate Content",
			offensive_language: "Offensive Language",
			misleading_information: "Misleading Information",
			privacy_violation: "Privacy Violation",
			duplicate_content: "Duplicate Content",
			other: "Other",
		};

		return res.status(200).json({
			success: true,
			message: `Experience reported for: ${reasonLabels[reason]}. Thank you for helping keep our community safe.`,
		});
	} catch (err) {
		console.error("Error in handleReport:", err.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const handleUpdateExperience = async (req, res) => {
	connectDB();
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
				key !== "scheduledForDeletion" &&
				key !== "unlisted"
			) {
				experienceDoc[key] = updateData[key];
			}
		});

		// Update sentiment analysis if overallFeedback was changed
		if (updateData.overallFeedback !== undefined) {
			const feedbackSentiment = updateData.overallFeedback
				? sentiment.analyze(updateData.overallFeedback)
				: { score: 0, comparative: 0 };
			experienceDoc.feedbackSentiment = {
				score: feedbackSentiment.score,
				comparative: feedbackSentiment.comparative,
				category: getSentimentCategory(feedbackSentiment.score),
			};
		}

		// If this was a content update and experience was reported/unlisted
		if (
			contentChanged &&
			experienceDoc.unlisted &&
			experienceDoc.reportedAt
		) {
			// Set content update timestamp
			experienceDoc.contentUpdatedAt = new Date();

			// Relist the experience
			experienceDoc.unlisted = false;
			experienceDoc.scheduledForDeletion = null;

			// Notify author that their post has been relisted
			const author = await User.findById(experienceDoc.user);
			if (author && author.email) {
				const subject = "Your reported post has been relisted";
				const content = `Thank you for updating your interview experience for ${experienceDoc.companyName}. 
				The changes you made have addressed the reports, and your post is now visible again.`;
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
	connectDB();
	const { limit } = req.query;
	try {
		// Only get experiences that are not unlisted
		const experienceDoc = await Experience.find({ unlisted: { $ne: true } })
			.sort({ createdAt: -1 })
			.limit(parseInt(limit) || 3);
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
	connectDB();
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
