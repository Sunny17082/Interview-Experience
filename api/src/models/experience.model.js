const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
	topic: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		default: "",
	},
	isCodingQuestion: {
		type: Boolean,
		default: false,
	},
	codingDifficulty: {
		type: Number,
		min: 1,
		max: 10,
		default: 5,
	},
});

const RoundSchema = new mongoose.Schema({
	number: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	questions: [QuestionSchema],
});

const experienceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
		name: {
			type: String,
			required: true,
			trim: true,
		},
		companyName: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			trim: true,
		},
		logo: {
			type: String,
			default: "",
		},
		interviewStatus: {
			type: String,
			required: true,
			enum: ["offered", "rejected", "in-process"],
		},
		packageOffered: {
			type: Number,
			min: 0,
		},
		challengesEncountered: {
			type: String,
			default: "",
		},
		overallFeedback: {
			type: String,
			default: "",
		},
		rounds: [RoundSchema],
		feedbackSentiment: {
            score: Number,
            comparative: Number,
            category: {
                type: String,
				enum: ["positive", "neutral", "negative"],
				default: "neutral",
            }
        },
		helpful: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		report: {
			type: Number,
			default: 0,
		}
	},
	{
		timestamps: true,
	}
);

const experience = mongoose.model(
	"Experience",
	experienceSchema
);

module.exports = experience;
