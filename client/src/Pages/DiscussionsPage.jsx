import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	MessageCircle,
	ThumbsUp,
	Clock,
	Search,
	Filter,
	Plus,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const DiscussionsPage = () => {
	const [discussions, setDiscussions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState("all");

	useEffect(() => {
		getDiscussion();
	}, []);

	const getDiscussion = async () => {
		try {
			const response = await axios.get("/discussion", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setDiscussions(response.data.discussionDoc);
			} else {
				console.error("Failed to fetch discussions");
				toast.error("Failed to fetch discussions");
			}
			setLoading(false);
		} catch (err) {
			console.error(err);
			toast.error("Failed to fetch discussions");
		}
	};

	const formatDateRelative = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diffTime / (1000 * 60));

		if (diffDays > 0) {
			return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
		} else if (diffHours > 0) {
			return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
		} else {
			return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
		}
	};

	const filteredDiscussions = discussions
		.filter(
			(discussion) =>
				discussion.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				discussion.excerpt
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		)
		.filter(
			(discussion) =>
				selectedType === "all" || discussion.type === selectedType
		);

	const discussionTypes = [
		{ value: "all", label: "All Discussions" },
		{ value: "general", label: "General" },
		{ value: "question", label: "Questions" },
		{ value: "feedback", label: "Feedback" },
		{ value: "tips", label: "Tips & Tricks" },
		{ value: "other", label: "Other" },
	];

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Discussions</h1>
				</div>
				<div className="space-y-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="animate-pulse bg-white rounded-lg shadow-md p-6"
						>
							<div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
							<div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
							<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
							<div className="flex justify-between">
								<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/6"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<h1 className="text-3xl font-bold text-gray-900">
					Discussions
				</h1>
				<Link
					to="/discussion/new"
					className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
				>
					<Plus size={18} className="mr-2" />
					New Discussion
				</Link>
			</div>

			{/* Filters and search */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search size={18} className="text-gray-400" />
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							placeholder="Search discussions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="relative w-full md:w-64">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Filter size={18} className="text-gray-400" />
						</div>
						<select
							className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white"
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
						>
							{discussionTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<svg
								className="h-5 w-5 text-gray-400"
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
				</div>
			</div>

			{/* Discussions list */}
			{filteredDiscussions.length > 0 ? (
				<div className="space-y-4">
					{filteredDiscussions.map((discussion) => (
						<Link
							key={discussion._id}
							to={`/discussion/${discussion._id}`}
							className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-center text-sm text-gray-600 mb-2">
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-800 mr-3">
									{discussion.type}
								</span>
								<span className="mr-2">
									{discussion.user.name}
								</span>
								<span className="flex items-center">
									<Clock size={14} className="mr-1" />
									{formatDateRelative(discussion.createdAt)}
								</span>
							</div>

							<h2 className="text-xl font-bold text-gray-900 mb-2">
								{discussion.title}
							</h2>
							<p className="text-gray-700 mb-4 line-clamp-2">
								{discussion.excerpt}
							</p>

							<div className="flex items-center text-gray-600">
								<div className="flex items-center mr-4">
									<MessageCircle size={16} className="mr-1" />
									{discussion.comments.length} comment
									{discussion.comments.length !== 1 ? "s" : ""}
								</div>
								<div className="flex items-center">
									<ThumbsUp size={16} className="mr-1" />
									{discussion.likes.length} like
									{discussion.likes.length !== 1 ? "s" : ""} 
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-md p-8 text-center">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No discussions found
					</h3>
					<p className="text-gray-600 mb-4">
						{searchTerm || selectedType !== "all"
							? "Try adjusting your search filters to find what you're looking for."
							: "Be the first to start a discussion!"}
					</p>
					{(searchTerm || selectedType !== "all") && (
						<button
							onClick={() => {
								setSearchTerm("");
								setSelectedType("all");
							}}
							className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
						>
							Clear filters
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default DiscussionsPage;
