const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["general", "feedback", "question", "tips", "other"],
			required: true,
        },
		comments: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				content: String,
				createdAt: { type: Date, default: Date.now },
				likes: [
					{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
				],
				dislikes: [
					{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
				],
			},
		],
		likes: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
		],
	},
	{ timestamps: true }
);

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;