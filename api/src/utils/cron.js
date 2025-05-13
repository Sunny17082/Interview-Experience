const cron = require("node-cron");
const Experience = require("../models/experience.model");
const Jobs = require("../models/jobs.model");

const initCronJobs = () => {
	cron.schedule("0 * * * *", async () => {
		console.log(
			"Running scheduled task: checking experiences for deletion"
		);
		try {
			const now = new Date();

			// Find experiences that are scheduled for deletion and past the deadline
			const expiredReports = await Experience.find({
				scheduledForDeletion: { $lte: now },
			});

			let deletedCount = 0;

			for (const exp of expiredReports) {
				// Check if content was updated after being reported
				const contentUpdated =
					exp.contentUpdatedAt &&
					exp.contentUpdatedAt > exp.reportedAt;

				if (contentUpdated) {
					// Content has been updated, clear the report status
					exp.report = 0;
					exp.reporters = [];
					exp.reportedAt = null;
					exp.contentUpdatedAt = null;
					exp.scheduledForDeletion = null;
					await exp.save();

					console.log(
						`Experience ${exp._id} was saved from deletion due to content updates`
					);
				} else {
					// Content hasn't been updated, proceed with deletion
					await Experience.findByIdAndDelete(exp._id);
					deletedCount++;
				}
			}

			if (deletedCount > 0) {
				console.log(
					`Deleted ${deletedCount} reported experiences past the 24-hour deadline`
				);
			}
		} catch (err) {
			console.error("Error in scheduled report cleanup job:", err);
		}
	});

	cron.schedule("0 * * * *", async () => {
		console.log("Running scheduled task: cleaning up expired job postings");
		try {
			const now = new Date();

			// Calculate the date that's 1 week ago from now
			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

			// Find and delete jobs whose application deadline has passed by more than a week
			const result = await Jobs.deleteMany({
				applicationDeadline: { $lt: oneWeekAgo },
			});

			if (result.deletedCount > 0) {
				console.log(
					`Deleted ${result.deletedCount} job postings with deadlines older than 1 week`
				);
			} else {
				console.log("No expired job postings found for deletion");
			}
		} catch (err) {
			console.error("Error in scheduled job cleanup task:", err);
		}
	});

	console.log("All cron jobs initialized");
};

module.exports = { initCronJobs };
