import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import SearchFilterSidebar from "../Components/SearchFilterSidebar";

const Experiences = () => {
	const [experiences, setExperiences] = useState([]);
	const [filteredExperiences, setFilteredExperiences] = useState([]);
	const [initialSearchTerm, setInitialSearchTerm] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	
	// States for modals
	const [showCompanyModal, setShowCompanyModal] = useState(false);
	const [showRoleModal, setShowRoleModal] = useState(false);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const searchQuery = searchParams.get("search");

	useEffect(() => {
		getExperience();
	}, []);

	useEffect(() => {
		if (searchQuery) {
			setInitialSearchTerm(searchQuery);
		}
	}, [searchQuery]);

	const getExperience = async () => {
		const response = await axios.get("/experience", {
			withCredentials: true,
		});

		if (response.data.success) {
			console.log(response.data.experienceDoc);
			setExperiences(response.data.experienceDoc);
			setFilteredExperiences(response.data.experienceDoc);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Interview Experiences
					</h1>
					<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
						{/* Filter Toggle Button - Mobile Only */}
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-4V9.414L3.293 6.707A1 1 0 013 6V4z" />
							</svg>
							Filters & Search
							<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
								{filteredExperiences.length}
							</span>
						</button>
						
						{/* Add Experience Button */}
						<Link
							to={"/experience/new"}
							className="flex items-center justify-center gap-2 bg-black hover:bg-black text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							<span className="hidden sm:inline">Add Experience</span>
							<span className="sm:hidden">Add</span>
						</Link>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Sidebar - Desktop always visible, Mobile collapsible */}
					<div className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block z-20`}>
						{/* Mobile Filter Overlay */}
						{showFilters && (
							<div 
								className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
								onClick={() => setShowFilters(false)}
							/>
						)}
						
						{/* Filter Sidebar */}
						<div className={`lg:relative ${showFilters ? 'fixed top-0 left-0 right-0 bottom-0 z-20 p-4' : ''} lg:p-0`}>
							<SearchFilterSidebar
								experiences={experiences}
								setFilteredExperiences={setFilteredExperiences}
								originalExperiences={experiences}
								initialSearchTerm={initialSearchTerm}
								showCompanyModal={showCompanyModal}
								setShowCompanyModal={setShowCompanyModal}
								showRoleModal={showRoleModal}
								setShowRoleModal={setShowRoleModal}
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								isMobile={showFilters}
								onCloseMobile={() => setShowFilters(false)}
							/>
						</div>
					</div>

					{/* Main Content */}
					<div className="w-full lg:w-3/4 space-y-4 sm:space-y-6 z-0">
						{/* Results Summary */}
						<div className="flex justify-between items-center text-sm text-gray-600">
							<span>
								Showing {filteredExperiences.length} of {experiences.length} experiences
							</span>
						</div>

						{filteredExperiences.length > 0 ? (
							filteredExperiences.map((experience) => (
								<Link
									to={`/experience/${experience._id}`}
									key={experience._id}
									className="block"
								>
									<div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-xl sm:hover:shadow-3xl">
										{/* Mobile Layout */}
										<div className="sm:hidden p-4">
											<div className="flex items-start gap-3 mb-3">
												<img
													src={experience.logo}
													alt={`${experience.companyName} logo`}
													className="w-12 h-12 object-contain rounded-lg flex-shrink-0"
												/>
												<div className="flex-grow min-w-0">
													<h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
														{experience.name}
													</h2>
													<p className="text-sm text-gray-600 mb-1">
														<span className="font-semibold">Role:</span> {experience.role}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-semibold">Company:</span> {experience.companyName}
													</p>
												</div>
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex-shrink-0
														${experience.interviewStatus === "offered"
															? "bg-green-100 text-green-800"
															: "bg-yellow-100 text-yellow-800"
														}`}
												>
													{experience.interviewStatus}
												</span>
											</div>
											
											<div className="flex justify-between items-center pt-3 border-t border-gray-200">
												<div className="text-center flex-1">
													<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
														Package
													</p>
													<p className="text-base font-bold text-gray-900">
														{experience.packageOffered} LPA
													</p>
												</div>
												<div className="text-center flex-1 border-l border-gray-200">
													<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
														Rounds
													</p>
													<p className="text-base font-bold text-gray-900">
														{experience.rounds.length}
													</p>
												</div>
											</div>
										</div>

										{/* Desktop Layout */}
										<div className="hidden sm:block p-6">
											<div className="flex items-center">
												<div className="mr-6 flex items-center justify-center">
													<img
														src={experience.logo}
														alt={`${experience.companyName} logo`}
														className="w-20 h-20 lg:w-30 lg:h-30 object-contain rounded-xl"
													/>
												</div>

												<div className="flex-grow">
													<div className="flex justify-between items-start">
														<div>
															<h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
																{experience.name}
															</h2>
															<div className="space-y-1">
																<p className="text-sm text-gray-600">
																	<span className="font-semibold text-gray-800">
																		Role:
																	</span>{" "}
																	{experience.role}
																</p>
																<p className="text-sm text-gray-600">
																	<span className="font-semibold text-gray-800">
																		Company:
																	</span>{" "}
																	{experience.companyName}
																</p>
															</div>
														</div>

														<span
															className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
																${experience.interviewStatus === "offered"
																	? "bg-green-100 text-green-800"
																	: "bg-yellow-100 text-yellow-800"
																}`}
														>
															{experience.interviewStatus}
														</span>
													</div>

													<div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
														<div>
															<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
																Package Offered
															</p>
															<p className="text-lg font-bold text-gray-900">
																{experience.packageOffered} LPA
															</p>
														</div>
														<div className="text-right">
															<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
																Interview Rounds
															</p>
															<p className="text-lg font-bold text-gray-900">
																{experience.rounds.length}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							))
						) : (
							<div className="bg-white p-6 sm:p-8 rounded-xl text-center space-y-4">
								<div>
									<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<p className="text-lg text-gray-600">
									No experiences match your filters
								</p>
								<p className="text-sm text-gray-500">
									Try adjusting your search criteria or clearing some filters
								</p>
								{searchTerm && (
									<div className="mt-6 flex flex-col items-center gap-2">
										<p className="text-sm text-gray-500">
											Looking for similar content? Try these resources:
										</p>
										<a
											href={`https://www.geeksforgeeks.org/tag/${searchTerm}/`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
										>
											Search for {searchTerm} on GeeksForGeeks
										</a>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Experiences;