const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	banner: {
		type: String,
	},
	description: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ["video", "article", "course"],
	},
	tags: {
		type: String,
		required: true,
		enum: [
			"DSA",
			"Web Development",
			"OOPs",
			"Operating System",
			"DBMS",
			"Computer Network",
			"System Design",
			"Java",
			"Python",
			"JavaScript",
			"C++",
			"C",
			"HTML",
			"CSS",
			"ReactJS",
			"NodeJS",
			"ExpressJS",
			"MongoDB",
			"MySQL",
			"PostgreSQL",
			"Git/GitHub",
			"Trending Technologies",
			"Behavioral",
			"Aptitude",
			"MR",
			"HR",
			"others"
		],
	},
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
	dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
});


const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;