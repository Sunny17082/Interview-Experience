import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CompaniesPage = () => {
	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		getCompany();
	}, []);

	const getCompany = async () => {
		const response = await axios.get("/company", {
			withCredentials: true,
		});
		const data = await response.data;
		if (data.success) {
			setCompanies(data.companyDoc);
			setLoading(false);
		} else {
			toast.error(data.message);
		}
	}

	// Filter companies based on search term and filter selection
	const filteredCompanies = companies.filter((company) => {
		const matchesSearch = company.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		if (filter === "all") return matchesSearch;

		// Filter by role type (tech/non-tech)
		const nonTechRoles = [""];
		const hasFilteredRole = company.roles.some((role) => {
			const isRolenonTech = nonTechRoles.some((nonTech) =>
				role.role.includes(nonTech)
			);
			return filter === "tech" ? isRolenonTech : !isRolenonTech;
		});

		return matchesSearch && hasFilteredRole;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-6xl mx-auto p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">Companies</h1>

			{/* Search and Filter */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
				<div className="relative w-full md:w-64">
					<input
						type="text"
						placeholder="Search companies..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>

				<div className="flex space-x-2">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded ${
							filter === "all"
								? "bg-gray-800 text-white"
								: "bg-gray-200 text-gray-800"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setFilter("tech")}
						className={`px-4 py-2 rounded ${
							filter === "tech"
								? "bg-gray-800 text-white"
								: "bg-gray-200 text-gray-800"
						}`}
					>
						Tech
					</button>
					<button
						onClick={() => setFilter("non-tech")}
						className={`px-4 py-2 rounded ${
							filter === "non-tech"
								? "bg-gray-800 text-white"
								: "bg-gray-200 text-gray-800"
						}`}
					>
						Non-Tech
					</button>
				</div>
			</div>

			{/* Company Cards */}
			{filteredCompanies.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-lg text-gray-600">
						No companies match your search criteria.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCompanies.map((company) => (
						<Link
							to={`/companies/${company._id}`}
							key={company._id}
							className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
						>
							<div className="h-44 bg-gray-50 flex items-center justify-center p-4">
								<img
									src={company.logo}
									alt={company.name}
									className="max-h-full max-w-full object-cover mix-blend-multiply"
								/>
							</div>
							<div className="p-4">
								<h2 className="text-xl font-semibold text-gray-800 mb-2">
									{company.name}
								</h2>

								<div className="mb-3">
									<p className="text-sm font-medium text-gray-600">
										Roles:
									</p>
									<div className="flex flex-wrap gap-2 mt-1">
										{company.roles.map((role, index) => (
											<span
												key={index}
												className="inline-block bg-gray-100 px-2 py-1 text-xs rounded"
											>
												{role.role} - {role.package}
											</span>
										))}
									</div>
								</div>

								<div>
									<p className="text-sm font-medium text-gray-600">
										Eligible Branches:
									</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{company.eligibility.branch.map(
											(branch, index) => (
												<span
													key={index}
													className="inline-block bg-gray-100 px-2 py-1 text-xs rounded"
												>
													{branch}
												</span>
											)
										)}
									</div>
								</div>

								<div className="mt-4 text-right">
									<span className="text-gray-800 font-medium text-sm hover:underline">
										View Details &rarr;
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default CompaniesPage;
