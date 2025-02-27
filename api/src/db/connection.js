const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(url);
		console.log("Database connected...");
	} catch (err) {
		console.log(err.message);
	}
};

module.exports = connectDB;
