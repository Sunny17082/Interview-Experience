const Resource = require("../models/resource.model");
const { verifyUserFromToken } = require("../utils/authentication");
const { connectDB } = require("../db/connection");

const handlePostResource = async (req, res) => {
	connectDB();
	const { title, banner, description, url, type, tags } = req.body;
	const { token } = req.cookies;
	try {
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const resourceDoc = await Resource.create({
			user: user.id,
			title,
			banner,
			description,
			url,
			type,
			tags,
		});
		return res.status(201).json({
			success: true,
			message: "Resource created successfully",
			data: resourceDoc,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

const handleGetResource = async (req, res) => {
	connectDB();
	try {
		const resourceDoc = await Resource.find({}).sort({ "likes": -1 });
		if (!resourceDoc) {
			return res.status(404).json({
				success: false,
				message: "Resource not found",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Resource fetched successfully",
			data: resourceDoc,
		});
	} catch (err) {
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
	try {
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const resourceDoc = await Resource.findById(id);
		if (!resourceDoc) {
			return res.status(404).json({ error: "resource not found" });
		}
		const userId = user.id;
		const isLiked = resourceDoc.likes.includes(userId);

		// If already liked, remove the like
		if (isLiked) {
			resourceDoc.likes = resourceDoc.likes.filter(
				(like) => JSON.stringify(like) !== JSON.stringify(userId)
			);
		}
		// If not liked, add like and remove from dislikes if present
		else {
			resourceDoc.likes.push(userId);
			// Remove from dislikes if present
			resourceDoc.dislikes = resourceDoc.dislikes.filter(
				(dislike) => JSON.stringify(dislike) !== JSON.stringify(userId)
			);
		}
		await resourceDoc.save();
		return res.status(200).json({
			success: true,
			message: isLiked ? "Like removed" : "Like added",
			resourceDoc,
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

const handleToggleDislike = async (req, res) => {
	connectDB();
	const { id } = req.params;
	const { token } = req.cookies;
	try {
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const resourceDoc = await Resource.findById(id);
		if (!resourceDoc) {
			return res.status(404).json({ error: "resource not found" });
		}
		const userId = user.id;
		const isDisliked = resourceDoc.dislikes.includes(userId);

		// If already disliked, remove the dislike
		if (isDisliked) {
			resourceDoc.dislikes = resourceDoc.dislikes.filter(
				(dislike) => JSON.stringify(dislike) !== JSON.stringify(userId)
			);
		}
		// If not disliked, add dislike and remove from likes if present
		else {
			resourceDoc.dislikes.push(userId);
			// Remove from likes if present
			resourceDoc.likes = resourceDoc.likes.filter(
				(like) => JSON.stringify(like) !== JSON.stringify(userId)
			);
		}
		await resourceDoc.save();
		return res.status(200).json({
			success: true,
			message: isDisliked ? "Dislike removed" : "Dislike added",
			resourceDoc,
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
    handlePostResource,
	handleGetResource,
	handleToggleLike,
	handleToggleDislike,
};
