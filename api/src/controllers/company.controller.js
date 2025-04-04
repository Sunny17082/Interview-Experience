const Company = require("../models/company.model");

const handlePostCompany = async (req, res) => {
	try {
		const { name, logo } = req.body;
		const companyDoc = await Company.create({
			name,
			logo,
		});

		return res.status(201).json({
			success: true,
			companyDoc,
			meassage: "Company created successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

module.exports = {
    handlePostCompany,
}