const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		googleId: {
			type: String,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		cId: {
			type: String,
			default: "",
		},
		verificationToken: {
			type: String,
		},
		verificationExpiry: {
			type: Date,
		},
		resetPasswordToken: {
			type: String,
		},
		resetPasswordExpiry: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const user = mongoose.model("User", userSchema);
module.exports = user;
