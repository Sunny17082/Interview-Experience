import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const JobsPage = () => {
	const currentDate = new Date();

	const [jobs, setJobs] = useState([]);
	const [expandedDescriptions, setExpandedDescriptions] = useState({});

	useEffect(() => {
		getJobs();
	}, []);

	const getJobs = async () => {
		try {
			const response = await axios.get("/jobs", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setJobs(response.data.data);
			}
		} catch (err) {
			toast.error("Failed to fetch jobs. Please try again later.");
		}
	};

	const [filters, setFilters] = useState({
		type: "",
		status: "",
		search: "",
	});

	const jobTypes = ["Internship", "Full-time"];

	// Toggle description expansion
	const toggleDescription = (jobId) => {
		setExpandedDescriptions((prev) => ({
			...prev,
			[jobId]: !prev[jobId],
		}));
	};

	// Check if job is open based on deadline
	const isJobOpen = (deadline) => {
		const deadlineDate = new Date(deadline);
		return deadlineDate > currentDate;
	};

	// Filter jobs based on current filters
	const filteredJobs = jobs.filter((job) => {
		const jobIsOpen = isJobOpen(job.applicationDeadline);

		if (filters.type && job.type !== filters.type) return false;
		if (filters.status === "open" && !jobIsOpen) return false;
		if (filters.status === "closed" && jobIsOpen) return false;
		if (
			filters.search &&
			!job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
			!job.company.toLowerCase().includes(filters.search.toLowerCase())
		)
			return false;
		return true;
	});

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters({
			...filters,
			[name]: value,
		});
	};

	const resetFilters = () => {
		setFilters({
			type: "",
			status: "",
			search: "",
		});
	};

	// Function to format date
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	// Function to handle job type badge color
	const getTypeBadgeColor = (type) => {
		switch (type) {
			case "Internship":
				return "bg-gray-200 text-gray-900";
			case "Full-time":
				return "bg-gray-900 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	// Function to generate background color for text banners
	const getTextBannerColor = (title) => {
		// Simple hash function to generate consistent colors based on title
		const hash = title
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		const colorOptions = [
			"bg-gray-800",
			"bg-gray-700",
			"bg-gray-900",
			"bg-black",
		];
		return colorOptions[hash % colorOptions.length];
	};

	return (
		<div className="min-h-screen bg-gray-100 py-6 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Jobs
					</h1>
					<Link
						to={"/jobs/new"}
						className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm font-medium"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-4 h-4 mr-1"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add Jobs
					</Link>
				</div>

				{/* Search and Filter Row */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					{/* Search - Left Side */}
					<div className="w-full md:w-1/2">
						<div className="relative">
							<input
								type="text"
								name="search"
								value={filters.search}
								onChange={handleFilterChange}
								placeholder="Search jobs..."
								className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							/>
							<div className="absolute left-3 top-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5 text-gray-400"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Filters - Right Side */}
					<div className="w-full md:w-1/2">
						<div className="flex flex-wrap gap-3">
							<div className="w-full sm:w-auto flex-1 relative">
								<select
									name="type"
									value={filters.type}
									onChange={handleFilterChange}
									className="w-full pl-3 pr-10 py-2 appearance-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
								>
									<option value="">All Types</option>
									{jobTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
									<svg
										className="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>

							<div className="w-full sm:w-auto flex-1 relative">
								<select
									name="status"
									value={filters.status}
									onChange={handleFilterChange}
									className="w-full pl-3 pr-10 py-2 appearance-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
								>
									<option value="">All Statuses</option>
									<option value="open">Open</option>
									<option value="closed">Closed</option>
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
									<svg
										className="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>

							{(filters.type ||
								filters.status ||
								filters.search) && (
								<button
									onClick={resetFilters}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className="w-4 h-4 mr-1"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
									Clear
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Results Count */}
				<div className="flex justify-between items-center mb-6">
					<div className="text-sm font-medium text-gray-600">
						{filteredJobs.length}{" "}
						{filteredJobs.length === 1 ? "job" : "jobs"} found
					</div>
				</div>

				{/* Jobs Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredJobs.length > 0 ? (
						filteredJobs.map((job) => {
							const open = isJobOpen(job.applicationDeadline);
							return (
								<div
									key={job._id}
									className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
								>
									{/* Banner with company name */}
									<div className="aspect-video relative">
										<div
											className={`w-full h-full ${getTextBannerColor(
												job.company
											)} flex items-center justify-center`}
										>
											<div className="text-center">
												<div className="font-bold text-gray-200 px-4">
													{job.company}
												</div>
											</div>
										</div>

										{/* Type Badge */}
										<div className="absolute top-3 right-3">
											<span
												className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
													job.type
												)}`}
											>
												{job.type}
											</span>
										</div>

										{/* Status Badge */}
										<div className="absolute bottom-3 left-3">
											<span
												className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
													open
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{open ? "Open" : "Closed"}
											</span>
										</div>
									</div>

									<div className="p-5 flex-grow flex flex-col">
										<h3 className="text-lg font-bold text-gray-900 mb-2">
											{job.title}
										</h3>

										{/* Description with dropdown */}
										<div className="mb-4 flex-grow">
											<button
												onClick={() =>
													toggleDescription(job._id)
												}
												className="flex w-full justify-between items-center text-sm font-medium text-gray-700 mb-2 hover:text-gray-900"
											>
												<span>Description</span>
												<svg
													className={`h-4 w-4 transition-transform ${
														expandedDescriptions[
															job._id
														]
															? "transform rotate-180"
															: ""
													}`}
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fillRule="evenodd"
														d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
														clipRule="evenodd"
													/>
												</svg>
											</button>

											{expandedDescriptions[job._id] && (
												<p className="text-gray-600 text-sm mb-3">
													{job.description}
												</p>
											)}
										</div>

										{/* Application Deadline */}
										<div className="flex justify-between items-center mb-3">
											<div className="flex items-center text-xs text-gray-500">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													className="w-4 h-4 mr-1"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span>
													Deadline:{" "}
													{formatDate(
														job.applicationDeadline
													)}
												</span>
											</div>

											{/* Apply Button */}
											<a
												href={job.url}
												target="_blank"
												rel="noopener noreferrer"
												className={`inline-flex items-center ${
													open
														? "bg-gray-800 text-white hover:bg-gray-700"
														: "bg-gray-300 text-gray-500 cursor-not-allowed"
												} px-3 py-1 rounded-md transition-colors text-xs font-medium`}
												onClick={(e) =>
													!open && e.preventDefault()
												}
											>
												{open ? "Apply" : "Closed"}
												{open && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="w-3 h-3 ml-1"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												)}
											</a>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="w-12 h-12 text-gray-400 mx-auto mb-3"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<p className="text-gray-500 text-lg mb-3">
								No jobs found matching your criteria.
							</p>
							<button
								onClick={resetFilters}
								className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
							>
								Reset Filters
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default JobsPage;
