const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true,
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
    }
}, {
    timestamps: true,
});

const user = mongoose.model("User", userSchema);
module.exports = user;