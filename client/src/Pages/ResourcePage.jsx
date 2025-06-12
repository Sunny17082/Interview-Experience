import { useContext, useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const ResourcePage = () => {
	const [resources, setResources] = useState([]);
	const { user } = useContext(UserContext);

	useEffect(() => {
		getResources();
		// eslint-disable-next-line
	}, [user]);

	const getResources = async () => {
		try {
			const response = await axios.get("/resource", {
				withCredentials: true,
			});
			if (response.status === 200) {
				if (response.data.data) {
					const processedResources = response.data.data.map(
						(resource) => {
							if (user) {
								const userId = user.id;
								const isLiked =
									resource.likes &&
									resource.likes.includes(userId);
								const isDisliked =
									resource.dislikes &&
									resource.dislikes.includes(userId);
								return {
									...resource,
									userInteraction: isLiked
										? "liked"
										: isDisliked
										? "disliked"
										: "none",
								};
							} else {
								return {
									...resource,
									userInteraction: "none",
								};
							}
						}
					);
					setResources(processedResources);
				} else {
					setResources([]);
				}
			}
		} catch (err) {
			toast.error("Error fetching resources");
			console.error("Error fetching resources:", err);
		}
	};

	const [filters, setFilters] = useState({
		type: "",
		tags: "",
		search: "",
	});

	const resourceTypes = ["video", "article", "course"];

	const availableTags = [
		"DSA",
		"Web Development",
		"OOPs",
		"Operating System",
		"DBMS",
		"Computer Network",
		"System Design",
		"Java",
		"Python",
		"JavaScript",
		"C++",
		"C",
		"HTML",
		"CSS",
		"ReactJS",
		"NodeJS",
		"ExpressJS",
		"MongoDB",
		"MySQL",
		"PostgreSQL",
		"Git/GitHub",
		"Trending Technologies",
		"Behavioral",
		"Aptitude",
		"MR",
		"HR",
	];

	const filteredResources = resources.filter((resource) => {
		if (filters.type && resource.type !== filters.type) return false;
		if (filters.tags && resource.tags !== filters.tags) return false;
		if (
			filters.search &&
			!resource.title
				.toLowerCase()
				.includes(filters.search.toLowerCase()) &&
			!resource.description
				.toLowerCase()
				.includes(filters.search.toLowerCase())
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
			tags: "",
			search: "",
		});
	};

	const handleLike = async (resourceId) => {
		if (!user) {
			toast.warning("Please login to like resources");
			return;
		}

		try {
			const response = await axios.post(
				`/resource/${resourceId}/like`,
				{},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				// Update local state to reflect changes
				setResources((prevResources) =>
					prevResources.map((resource) => {
						if (resource._id === resourceId) {
							const updatedDoc = response.data.resourceDoc;
							const userId = user.id;
							const isLiked = updatedDoc.likes.includes(userId);
							const isDisliked =
								updatedDoc.dislikes.includes(userId);

							return {
								...resource,
								likes: updatedDoc.likes.length,
								dislikes: updatedDoc.dislikes.length,
								userInteraction: isLiked
									? "liked"
									: isDisliked
									? "disliked"
									: "none",
							};
						}
						return resource;
					})
				);
				getResources();
				toast.success(response.data.message);
			}
		} catch (err) {
			toast.error("Error updating like");
			console.error("Error liking resource:", err);
		}
	};

	const handleDislike = async (resourceId) => {
		if (!user) {
			toast.warning("Please login to dislike resources");
			return;
		}

		try {
			const response = await axios.post(
				`/resource/${resourceId}/dislike`,
				{},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				// Update local state to reflect changes
				setResources((prevResources) =>
					prevResources.map((resource) => {
						if (resource._id === resourceId) {
							const updatedDoc = response.data.resourceDoc;
							const userId = user.id;
							const isLiked = updatedDoc.likes.includes(userId);
							const isDisliked =
								updatedDoc.dislikes.includes(userId);

							return {
								...resource,
								likes: updatedDoc.likes.length,
								dislikes: updatedDoc.dislikes.length,
								userInteraction: isLiked
									? "liked"
									: isDisliked
									? "disliked"
									: "none",
							};
						}
						return resource;
					})
				);

				

				getResources();
				toast.success(response.data.message);
			}
		} catch (err) {
			toast.error("Error updating dislike");
			console.error("Error disliking resource:", err); 
		}
	};

	// Function to handle resource type badge color
	const getTypeBadgeColor = (type) => {
		switch (type) {
			case "video":
				return "bg-gray-900 text-white";
			case "article":
				return "bg-gray-200 text-gray-900";
			case "course":
				return "bg-gray-700 text-white";
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
				{/* Header with Add Resource Button */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Resources
					</h1>
					<Link
						to={"/resources/new"}
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
						Add Resource
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
								placeholder="Search resources..."
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
									{resourceTypes.map((type) => (
										<option key={type} value={type}>
											{type.charAt(0).toUpperCase() +
												type.slice(1)}
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
									name="tags"
									value={filters.tags}
									onChange={handleFilterChange}
									className="w-full pl-3 pr-10 py-2 appearance-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
								>
									<option value="">All Tags</option>
									{availableTags.map((tag) => (
										<option key={tag} value={tag}>
											{tag}
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

							{(filters.type ||
								filters.tags ||
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
						{filteredResources.length}{" "}
						{filteredResources.length === 1
							? "resource"
							: "resources"}{" "}
						found
					</div>
				</div>

				{/* Resources Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredResources.length > 0 ? (
						filteredResources.map((resource) => (
							<div
								key={resource._id}
								className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
							>
								{/* Banner Image or Text Banner */}
								<div className="aspect-video relative">
									{resource.banner ? (
										<img
											src={resource.banner}
											alt={resource.title}
											className="w-full h-50 object-contain"
										/>
									) : (
										<div
											className={`w-full h-full ${getTextBannerColor(
												resource.title
											)} flex items-center justify-center`}
										>
											<div className="text-center">
												<div className="font-bold text-gray-200 px-4">
													{resource.title}
												</div>
											</div>
										</div>
									)}
									{/* Type Badge */}
									<div className="absolute top-3 right-3">
										<span
											className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
												resource.type
											)}`}
										>
											{resource.type}
										</span>
									</div>

									{/* Like/Dislike Buttons - Positioned above the title */}
									<div className="absolute bottom-3 left-3 flex space-x-2">
										<button
											onClick={() =>
												handleLike(resource._id)
											}
											className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
												resource.userInteraction ===
												"liked"
													? "bg-white text-gray-800"
													: "bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-90"
											}`}
										>
											<ThumbsUp
												size={16}
												className={
													resource.userInteraction ===
													"liked"
														? "fill-current"
														: ""
												}
											/>
											<span className="text-xs font-medium">
												{resource.likes.length}
											</span>
										</button>

										<button
											onClick={() =>
												handleDislike(resource._id)
											}
											className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
												resource.userInteraction ===
												"disliked"
													? "bg-white text-gray-800"
													: "bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-90"
											}`}
										>
											<ThumbsDown
												size={16}
												className={
													resource.userInteraction ===
													"disliked"
														? "fill-current"
														: ""
												}
											/>
											<span className="text-xs font-medium">
												{resource.dislikes.length}
											</span>
										</button>
									</div>
								</div>

								<div className="p-5 flex-grow flex flex-col">
									<h3 className="text-lg font-bold text-gray-900 mb-2">
										{resource.title}
									</h3>
									<p className="text-gray-600 mb-4 flex-grow text-sm line-clamp-3">
										{resource.description}
									</p>

									{/* Tag */}
									<div className="flex justify-between items-center mb-3">
										<span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
											{resource.tags}
										</span>

										{/* View Button */}
										<a
											href={resource.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs font-medium"
										>
											View
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
										</a>
									</div>
								</div>
							</div>
						))
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
								No resources found matching your criteria.
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

export default ResourcePage;