const Jobs = require("../models/jobs.model");
const { verifyUserFromToken } = require("../utils/authentication");
const connectDB = require("../db/connection");


const handlePostJobs = async (req, res) => {
	connectDB();
	const { title, description, company, url, type, applicationDeadline } = req.body;
	const { token } = req.cookies;
	try {
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const user = await verifyUserFromToken(token);
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const jobsDoc = await Jobs.create({
			user: user.id,
			title,
            description,
            company,
			url,
			type,
			applicationDeadline,
		});
		return res.status(201).json({
			success: true,
			message: "jobs created successfully",
			data: jobsDoc,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

const handleGetJobs = async (req, res) => {
	connectDB();
	try {
		const jobsDoc = await Jobs.find({}).sort({ applicationDeadline: -1 });
		if (!jobsDoc) {
			return res.status(404).json({
				success: false,
				message: "jobs not found",
			});
		}
		return res.status(200).json({
			success: true,
			message: "jobs fetched successfully",
			data: jobsDoc,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: err.message,
		});
	}
};

module.exports = {
	handlePostJobs,
	handleGetJobs,
};