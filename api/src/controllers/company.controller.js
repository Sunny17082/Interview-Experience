const Company = require("../models/company.model");

const handlePostCompany = async (req, res) => {
	try {
		const { name, logo, links, linkedIn, roles, eligibility } = req.body;
		const companyDoc = await Company.create({
			name,
			logo,
			links,
			linkedIn,
			roles,
			eligibility,
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

const handleGetCompany = async (req, res) => {
	try {
		const companyDoc = await Company.find({});
		if (!companyDoc) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}
		return res.status(200).json({
			success: true,
			companyDoc,
			message: "Company fetched successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleGetCompanyById = async (req, res) => {
	try {
		const { id } = req.params;
		const companyDoc = await Company.findById(id);
		if (!companyDoc) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}
		return res.status(200).json({
			success: true,
			companyDoc,
			message: "Company fetched successfully",
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const handleUpdateCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, logo, links, linkedIn, roles, eligibility } = req.body;
		const companyDoc = await Company.findByIdAndUpdate(id, {
			name,
			logo,
			links,
			linkedIn,
			roles,
			eligibility,
		});
		if (!companyDoc) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}
		return res.status(200).json({
			success: true,
			companyDoc,
			message: "Company updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}

const handleDeleteCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const companyDoc = await Company.findByIdAndDelete(id);
		if (!companyDoc) {
			return res.status(404).json({
				success: false,
				message: "Company not found",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Company deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}

module.exports = {
	handlePostCompany,
	handleGetCompany,
	handleGetCompanyById,
	handleUpdateCompany,
	handleDeleteCompany,
};