const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
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
        enum: [
            "Internship",
            "Full-time"
        ]
    },
    applicationDeadline: {
        type: Date,
        required: true,
    },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;