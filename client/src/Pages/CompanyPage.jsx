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
			<div className="w-full max-w-4xl mx-auto p-6">
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
		<div className="w-full max-w-4xl mx-auto p-6">
			<div className="mb-6">
				<Link to="/companies" className="text-gray-700 hover:underline">
					&larr; Back to companies
				</Link>
			</div>

			{/* Company Header */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
					<div className="w-32 h-32 flex items-center justify-center bg-gray-50 p-4 rounded-md">
						<img
							src={company.logo}
							alt={company.name}
							className="max-w-full max-h-full object-cover mix-blend-multiply"
						/>
					</div>

					<div className="flex-1 text-center md:text-left">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							{company.name}
						</h1>

						{linksList.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-3 justify-center md:justify-start">
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
										className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
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
										{
											link
												.replace(
													/^https?:\/\/(www\.)?/,
													""
												)
												.split("/")[0]
										}
									</a>
								))}
							</div>
						)}

						{/* {company.timeline && (
							<div className="bg-yellow-50 p-3 rounded-md text-sm">
								<p className="text-yellow-800">
									<strong>Timeline:</strong>{" "}
									{company.timeline}
								</p>
							</div>
						)} */}
					</div>
				</div>
			</div>

			{/* Roles Section */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
					Available Roles
				</h2>

				<div className="space-y-6">
					{company.roles.map((role, index) => (
						<div key={index} className="bg-gray-50 p-4 rounded-md">
							<div className="flex flex-col md:flex-row justify-between mb-2">
								<h3 className="text-lg font-medium text-gray-800">
									{role.role}
								</h3>
								<span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block">
									{role.package} LPA
								</span>
							</div>
							{role.information && (
								<pre className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
									{role.information}
								</pre>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Eligibility Section */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
					Eligibility Criteria
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-sm text-gray-500">Class X</p>
						<p className="text-lg font-medium">
							{company.eligibility.classX}% or above
						</p>
					</div>

					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-sm text-gray-500">Class XII</p>
						<p className="text-lg font-medium">
							{company.eligibility.classXII}% or above
						</p>
					</div>

					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-sm text-gray-500">Graduation</p>
						<p className="text-lg font-medium">
							{company.eligibility.graduation}% or above
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-sm text-gray-500">
							Eligible Branches
						</p>
						<div className="flex flex-wrap gap-2 mt-2">
							{company.eligibility.branch.map((branch, index) => (
								<span
									key={index}
									className="bg-gray-200 px-2 py-1 rounded text-sm"
								>
									{branch}
								</span>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-50 p-4 rounded-md">
							<p className="text-sm text-gray-500">
								Maximum Backlogs
							</p>
							<p className="text-lg font-medium">
								{company.eligibility.backlogs}
							</p>
						</div>

						<div className="bg-gray-50 p-4 rounded-md">
							<p className="text-sm text-gray-500">
								Education Gap
							</p>
							<p className="text-lg font-medium">
								Up to {company.eligibility.gap} year(s)
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Selection Process */}
			{/* {company.process && (
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
						Selection Process
					</h2>

					<div className="relative pl-8">
						{company.process.map((step, index) => (
							<div key={index} className="mb-6 relative">
								<div className="absolute -left-8 mt-1.5 h-4 w-4 rounded-full bg-gray-800"></div>
								{index < company.process.length - 1 && (
									<div className="absolute -left-6.5 mt-6 h-full w-0.5 bg-gray-300"></div>
								)}
								<div>
									<h3 className="text-lg font-medium text-gray-800">
										Step {index + 1}
									</h3>
									<p className="text-gray-600 mt-1">{step}</p>
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
