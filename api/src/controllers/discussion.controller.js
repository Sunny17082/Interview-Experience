const Discussion = require("../models/discussion.model");
const { verifyUserFromToken } = require("../utils/authentication");
const { sendMail } = require("../utils/mailingService");
const connectDB = require("../db/connection");
const User = require("../models/user.model");

const handlePostDiscussion = async (req, res) => {
	connectDB();
	try {
		const { title, type, content } = req.body;
		const { token } = req.cookies;
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		if (!title || !type || !content) {
			return res.status(400).json({ error: "Missing required fields" });
		}
		if (title.length > 100) {
			return res.status(400).json({ error: "Title is too long" });
		}
		const discussionDoc = await Discussion.create({
			title,
			type,
			content,
			user: user.id,
		});
		return res.status(201).json({
			success: true,
			message: "Discussion created successfully",
			discussionDoc,
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};

const handleGetDiscussion = async (req, res) => {
	connectDB();
	try {
		const discussionDoc = await Discussion.find({}).populate(
			"user",
			"name email"
		);
		return res.status(200).json({ success: true, discussionDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

const handleGetDiscussionById = async (req, res) => {
	connectDB();
	const { id } = req.params;
	try {
		const discussionDoc = await Discussion.findById(id)
			.populate("user", "name email")
			.populate("comments.user", "name email");
		if (!discussionDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Discussion not found" });
		}
		return res.status(200).json({ success: true, discussionDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

const handleToggleLike = async (req, res) => {
	connectDB();
	const { id } = req.params;
	const { token } = req.cookies;
	// Verify user from token
	try {
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		// Find discussion by ID and toggle like
		const discussionDoc = await Discussion.findById(id);
		if (!discussionDoc) {
			return res.status(404).json({ error: "Discussion not found" });
		}
		const userId = user.id;
		const isLiked = discussionDoc.likes.includes(userId);
		if (isLiked) {
			discussionDoc.likes = discussionDoc.likes.filter(
				(like) => JSON.stringify(like) !== JSON.stringify(userId)
			);
		} else {
			discussionDoc.likes.push(userId);
		}
		await discussionDoc.save();
		return res.status(200).json({
			success: true,
			message: isLiked ? "Like removed" : "Like added",
			discussionDoc,
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

const handlePostComment = async (req, res) => {
	connectDB();
	const { comment } = req.body;
	const { id } = req.params;
	const { token } = req.cookies;
	// Verify user from token
	try {
		const user = await verifyUserFromToken(token);
		console.log("User from token:", user);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}
		const discussionDoc = await Discussion.findById(id);
		if (!discussionDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Discussion not found" });
		}
		if (!comment) {
			return res
				.status(400)
				.json({ success: false, message: "Missing required fields" });
		}
		if (!discussionDoc.comments) {
			discussionDoc.comments = [];
		}
		discussionDoc.comments.push({
			content: comment,
			user: user.id,
			username: user.name,
			createdAt: new Date(),
		});
		await discussionDoc.save();

		const discussionAuthor = await User.findById(discussionDoc.user);

		if (
			discussionAuthor &&
			discussionAuthor.email &&
			discussionAuthor._id.toString() !== user.id.toString()
		) {
			sendMail(
				discussionAuthor.name,
				discussionAuthor.email,
				"Somone commented on your discussion",
				`Your discussion for ${discussionDoc.title} has a new comment`,
				"View Discussion",
				`${process.env.FRONTEND_URL}/discussion/${discussionDoc._id}`
			);
		}
		return res.status(201).json({
			success: true,
			message: "Comment added successfully",
			discussionDoc,
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

module.exports = {
	handlePostDiscussion,
	handleGetDiscussion,
	handleGetDiscussionById,
	handleToggleLike,
	handlePostComment,
};
