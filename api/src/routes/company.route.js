const express = require("express");
const router = express.Router();
const {
	handlePostCompany,
	handleGetCompany,
	handleGetCompanyById,
	handleUpdateCompany,
	handleDeleteCompany,
	handleGetCompanyByLimit
} = require("../controllers/company.controller");

router.post("/", handlePostCompany);
router.get("/", handleGetCompany);
router.get("/:id", handleGetCompanyById);
router.put("/:id", handleUpdateCompany);
router.delete("/:id", handleDeleteCompany);
router.get("/limit/:limit", handleGetCompanyByLimit);

module.exports = router;