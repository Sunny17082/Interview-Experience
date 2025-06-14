import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CompanyPage = () => {
	const { id } = useParams();
	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCompanyById();
	}, [id]);

	const getCompanyById = async () => {
		try {
			const response = await axios.get(`/company/${id}`, {
				withCredentials: true,
			});
			console.log(response.data);
			if (response.status === 200) {
				setCompany(response.data.companyDoc);
				setLoading(false);
			} else {
				toast.error("Failed to fetch company data");
				console.error("Failed to fetch company data");
				setLoading(false);
			}
		} catch (err) {
			toast.error(err.response.data.message || "An error occurred");
			console.error(err);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (!company) {
		return (
			<div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
				<div className="bg-red-50 p-4 rounded-md">
					<p className="text-red-700">Company not found.</p>
				</div>
				<div className="mt-4">
					<Link
						to="/companies"
						className="text-gray-700 hover:underline"
					>
						&larr; Back to companies
					</Link>
				</div>
			</div>
		);
	}

	// Parse company links
	const linksList = company.links
		? company.links.split(",").map((link) => link.trim())
		: [];

	return (
		<div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
			<div className="mb-4 sm:mb-6">
				<Link to="/companies" className="text-gray-700 hover:underline text-sm sm:text-base">
					&larr; Back to companies
				</Link>
			</div>

			{/* Company Header */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
				<div className="flex flex-col items-center gap-4 sm:gap-6 sm:flex-row sm:items-start">
					<div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-50 p-3 sm:p-4 rounded-md flex-shrink-0">
						<img
							src={company.logo}
							alt={company.name}
							className="max-w-full max-h-full object-cover mix-blend-multiply"
						/>
					</div>

					<div className="flex-1 text-center sm:text-left w-full">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words">
							{company.name}
						</h1>

						{linksList.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
								{linksList.map((link, index) => (
									<a
										key={index}
										href={
											link.startsWith("http")
												? link
												: `https://${link}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm sm:text-base break-all"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
										<span className="truncate max-w-[120px] sm:max-w-none">
											{
												link
													.replace(
														/^https?:\/\/(www\.)?/,
														""
													)
													.split("/")[0]
											}
										</span>
									</a>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Roles Section */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
					Available Roles
				</h2>

				<div className="space-y-4 sm:space-y-6">
					{company.roles.map((role, index) => (
						<div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-md">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
								<h3 className="text-base sm:text-lg font-medium text-gray-800 break-words">
									{role.role}
								</h3>
								<span className="bg-gray-800 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto whitespace-nowrap">
									{role.package} LPA
								</span>
							</div>
							{role.information && (
								<pre className="text-gray-600 text-xs sm:text-sm mt-2 whitespace-pre-wrap break-words overflow-x-auto">
									{role.information}
								</pre>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Eligibility Section */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
					Eligibility Criteria
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
					<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
						<p className="text-xs sm:text-sm text-gray-500">Class X</p>
						<p className="text-base sm:text-lg font-medium">
							{company.eligibility.classX}% or above
						</p>
					</div>

					<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
						<p className="text-xs sm:text-sm text-gray-500">Class XII</p>
						<p className="text-base sm:text-lg font-medium">
							{company.eligibility.classXII}% or above
						</p>
					</div>

					<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
						<p className="text-xs sm:text-sm text-gray-500">Graduation</p>
						<p className="text-base sm:text-lg font-medium">
							{company.eligibility.graduation}% or above
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
					<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
						<p className="text-xs sm:text-sm text-gray-500 mb-2">
							Eligible Branches
						</p>
						<div className="flex flex-wrap gap-1 sm:gap-2">
							{company.eligibility.branch.map((branch, index) => (
								<span
									key={index}
									className="bg-gray-200 px-2 py-1 rounded text-xs sm:text-sm break-words"
								>
									{branch}
								</span>
							))}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
							<p className="text-xs sm:text-sm text-gray-500">
								Maximum Backlogs
							</p>
							<p className="text-base sm:text-lg font-medium">
								{company.eligibility.backlogs}
							</p>
						</div>

						<div className="bg-gray-50 p-3 sm:p-4 rounded-md">
							<p className="text-xs sm:text-sm text-gray-500">
								Education Gap
							</p>
							<p className="text-base sm:text-lg font-medium">
								Up to {company.eligibility.gap} year(s)
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Selection Process */}
			{/* {company.process && (
				<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
						Selection Process
					</h2>

					<div className="relative pl-6 sm:pl-8">
						{company.process.map((step, index) => (
							<div key={index} className="mb-4 sm:mb-6 relative">
								<div className="absolute -left-6 sm:-left-8 mt-1.5 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-gray-800"></div>
								{index < company.process.length - 1 && (
									<div className="absolute -left-5 sm:-left-6.5 mt-4 sm:mt-6 h-full w-0.5 bg-gray-300"></div>
								)}
								<div>
									<h3 className="text-base sm:text-lg font-medium text-gray-800">
										Step {index + 1}
									</h3>
									<p className="text-gray-600 mt-1 text-sm sm:text-base break-words">{step}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)} */}
		</div>
	);
};

export default CompanyPage;