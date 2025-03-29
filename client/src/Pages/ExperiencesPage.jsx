import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchFilterSidebar from "../Components/SearchFilterSidebar";

const Experiences = () => {
	const [experiences, setExperiences] = useState([]);
	const [filteredExperiences, setFilteredExperiences] = useState([]);

	useEffect(() => {
		getExperience();
	}, []);

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
		<div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Sidebar */}
					<div className="w-full md:w-1/4">
						<SearchFilterSidebar
							experiences={experiences}
							setFilteredExperiences={setFilteredExperiences}
							originalExperiences={experiences}
						/>
					</div>

					{/* Main Content */}
					<div className="w-full md:w-3/4 space-y-8">
						{filteredExperiences.length > 0 ? (
							filteredExperiences.map((experience) => (
								<Link
									to={`/experience/${experience._id}`}
									key={experience._id}
									className="block"
								>
									<div
										className="bg-white border border-gray-200 rounded-3xl shadow-2xl 
										overflow-hidden transform transition-all duration-300 
										hover:scale-[1.02] hover:shadow-3xl"
									>
										<div className="p-6 flex items-center">
											{/* Logo Section */}
											<div className="mr-6 flex items-center justify-center">
												<img
													src={
														"https://duncanlock.net/images/posts/better-figures-images-plugin-for-pelican/dummy-200x200.png"
													}
													alt={`${experience.companyName} logo`}
													className="w-26 h-26 object-cover rounded-xl"
												/>
											</div>

											{/* Details Section */}
											<div className="flex-grow">
												<div className="flex justify-between items-start">
													<div>
														<h2 className="text-2xl font-bold text-gray-900 mb-1">
															{experience.name}
														</h2>
														<div className="space-y-1">
															<p className="text-sm text-gray-600">
																<span className="font-semibold text-gray-800">
																	Role:
																</span>{" "}
																{
																	experience.role
																}
															</p>
															<p className="text-sm text-gray-600">
																<span className="font-semibold text-gray-800">
																	Company:
																</span>{" "}
																{
																	experience.companyName
																}
															</p>
														</div>
													</div>

													{/* Status Badge */}
													<span
														className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
																${
																	experience.interviewStatus ===
																	"offered"
																		? "bg-green-100 text-green-800"
																		: "bg-yellow-100 text-yellow-800"
																}`}
													>
														{
															experience.interviewStatus
														}
													</span>
												</div>

												{/* Package and Rounds */}
												<div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
													<div>
														<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
															Package Offered
														</p>
														<p className="text-lg font-bold text-gray-900">
															{
																experience.packageOffered
															}{" "}
															LPA
														</p>
													</div>
													<div className="text-right">
														<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
															Interview Rounds
														</p>
														<p className="text-lg font-bold text-gray-900">
															{
																experience
																	.rounds
																	.length
															}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							))
						) : (
							<div className="bg-white p-8 rounded-xl text-center">
								<p className="text-lg text-gray-600">
									No experiences match your filters. Try
									adjusting your criteria.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Experiences;
