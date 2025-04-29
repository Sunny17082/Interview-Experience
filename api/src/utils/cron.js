const cron = require("node-cron");
const Experience = require("../models/experience.model");

const initCronJobs = () => {
	// Run every hour to check for experiences scheduled for deletion
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

	// You can add additional cron jobs here

	console.log("All cron jobs initialized");
};

module.exports = { initCronJobs };
