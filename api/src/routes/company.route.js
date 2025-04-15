const express = require("express");
const router = express.Router();
const {
	handlePostCompany,
	handleGetCompany,
	handleGetCompanyById,
	handleUpdateCompany,
	handleDeleteCompany,
} = require("../controllers/company.controller");

router.post("/", handlePostCompany);
router.get("/", handleGetCompany);
router.get("/:id", handleGetCompanyById);
router.put("/:id", handleUpdateCompany);
router.delete("/:id", handleDeleteCompany);

module.exports = router;