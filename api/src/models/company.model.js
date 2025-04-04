const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        required: true,
    },
    roles: {
        type: [{
            role: {
                type: String,
            },
            package: {
                type: String,
            },
            information: {
                type: String,
            }
        }]
    },
    links: {
        type: String,
    },
    eligibility: {
        type: {
            classX: {
                type: Number,
            },
            classXII: {
                type: Number,
            },
            graduation: {
                type: Number,
            },
            branch: {
                type: [String],
            },
            backlogs: {
                type: Number,
            },
            gap: {
                type: Number,
            },
        }
    },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;