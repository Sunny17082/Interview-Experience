import React, { useEffect, useState } from "react";
import {
	Search,
	ChevronRight,
	MessageSquare,
	Building,
	ChevronDown,
	TrendingUp,
	Book,
	Star,
	Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const IndexPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const [featuredCompanies, setFeaturedCompanies] = useState([]);

	useEffect(() => {
		getCompany();
	}, [])

	const getCompany = async () => {
		try {
			const response = await axios.get("/company", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setFeaturedCompanies(response.data.companyDoc);
				console.log(response.data);
			}
		} catch (err) {
			console.error("Error fetching companies:", err);
		}
	};

	const recentExperiences = [
		{
			name: "Sunny Prasad",
			role: "Software Engineer",
			companyName: "Google",
			interviewStatus: "Accepted",
			packageOffered: "60 LPA",
			rounds: 3,
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			helpful: new Array(35),
			views: 300,
		},
		{
			name: "Sunny Prasad",
			role: "Product Manager",
			companyName: "Amazon",
			interviewStatus: "Rejected",
			packageOffered: "30 LPA",
			rounds: 2,
			createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
			helpful: new Array(35),
			views: 289,
		},
		{
			name: "Sunny Prasad",
			role: "SDE",
			companyName: "Microsoft",
			interviewStatus: "Pending",
			packageOffered: "20 LPA",
			rounds: 3,
			createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			helpful: new Array(35),
			views: 170,
		},
	];

	const handleSearch = (e) => {
		if (e) e.preventDefault();
		window.location.href = `/experience?search=${encodeURIComponent(
			searchQuery
		)}`;
	};

	const getDaysAgo = (date) => {
		const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
		return days === 1 ? "1 day" : `${days} days`;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-b from-black to-gray-900 text-white">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Learn from Real Interview Experiences
					</h1>
					<div className="text-center max-w-3xl mx-auto mb-10">
						<p className="text-xl text-gray-300 mb-8">
							Prepare for your next interview with insights from
							thousands of candidates
						</p>

						{/* Search Bar */}
						<div className="relative max-w-2xl mx-auto mb-8">
							<form onSubmit={handleSearch}>
								<input
									type="text"
									placeholder="Search by company or role..."
									className="w-full py-3 px-5 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
								<button
									type="submit"
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
								>
									<Search className="h-4 w-4" />
								</button>
							</form>
						</div>
					</div>

					{/* Action Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						<Link
							to="/experience/new"
							className="bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white p-5 rounded-xl transition-all border border-white/10 group flex flex-col items-center text-center"
						>
							<div className="bg-white/10 p-3 rounded-full mb-3 group-hover:bg-white/20 transition-colors">
								<Book className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-semibold mb-2">
								Share Your Experience
							</h3>
							<p className="text-gray-400 mb-3 text-sm">
								Help others by sharing your interview journey
								and preparation strategies
							</p>
							<span className="mt-auto inline-flex items-center text-white text-sm font-medium">
								Share Now{" "}
								<ChevronRight className="h-3 w-3 ml-1" />
							</span>
						</Link>

						<Link
							to="/discussion/new"
							className="bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white p-5 rounded-xl transition-all border border-white/10 group flex flex-col items-center text-center"
						>
							<div className="bg-white/10 p-3 rounded-full mb-3 group-hover:bg-white/20 transition-colors">
								<MessageSquare className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-semibold mb-2">
								Start a Discussion
							</h3>
							<p className="text-gray-400 mb-3 text-sm">
								Ask questions or start conversations about
								interview processes and techniques
							</p>
							<span className="mt-auto inline-flex items-center text-white text-sm font-medium">
								Post Discussion{" "}
								<ChevronRight className="h-3 w-3 ml-1" />
							</span>
						</Link>
					</div>

					{/* Scroll Indicator */}
					<div className="flex justify-center mt-14">
						<div className="animate-bounce bg-white/20 p-1.5 rounded-full">
							<ChevronDown className="h-5 w-5 text-white" />
						</div>
					</div>
				</div>
			</div>

			{/* Featured Companies */}
			<section className="py-14 bg-white">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-gray-900">
							Popular Companies
						</h2>
						<Link
							to={"/companies"}
							className="text-sm font-medium text-gray-600 flex items-center hover:text-gray-900 transition-colors"
						>
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
						{featuredCompanies.map((company) => (
							<div
								key={company.name}
								className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:translate-y-px"
							>
								<div className="p-4">
									<div className="flex items-center mb-3">
										<div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
											<Building className="h-4 w-4 text-gray-700" />
										</div>
									</div>
									<h3 className="font-semibold text-gray-900 text-sm">
										{company.name}
									</h3>
									<Link to={`/companies/${company._id}`} className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
										<span className="text-xs text-gray-500">
											View details
										</span>
										<ChevronRight className="h-3 w-3 text-gray-400" />
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Recent Interviews - Updated with simplified information */}
			<section className="py-14 bg-gray-50">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Recent Experiences
							</h2>
							<p className="text-gray-500 mt-1 text-sm">
								Learn from recent interviews shared by our
								community
							</p>
						</div>
						<Link
							to={"/experience"}
							className="text-sm font-medium text-gray-600 flex items-center hover:text-gray-900 transition-colors"
						>
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{recentExperiences.map((item, index) => (
							<div
								key={index}
								className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all border border-gray-100"
							>
								<div className="p-5">
									{/* Company and Role */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center">
											<div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
												<Building className="h-4 w-4 text-gray-500" />
											</div>
											<div className="ml-3">
												<h3 className="font-medium text-gray-900 text-sm">
													{item.role}
												</h3>
												<p className="text-xs text-gray-500">
													at {item.companyName}
												</p>
											</div>
										</div>
										<span
											className={`text-xs px-2 py-0.5 rounded-full ${
												item.interviewStatus ===
												"Accepted"
													? "bg-green-100 text-green-800"
													: item.interviewStatus ===
													  "Rejected"
													? "bg-red-100 text-red-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{item.interviewStatus}
										</span>
									</div>

									{/* Core Information - Just the essentials */}
									<div className="grid grid-cols-2 gap-3 mb-4 text-xs">
										<div className="bg-gray-50 p-2 rounded border border-gray-100">
											<span className="block text-gray-500">
												Package
											</span>
											<span className="font-medium text-gray-800">
												{item.packageOffered}
											</span>
										</div>
										<div className="bg-gray-50 p-2 rounded border border-gray-100">
											<span className="block text-gray-500">
												Rounds
											</span>
											<span className="font-medium text-gray-800">
												{item.rounds}
											</span>
										</div>
									</div>

									{/* Stats and Date */}
									<div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
										<span>
											{getDaysAgo(item.createdAt)} ago
										</span>
										<div className="flex items-center gap-3">
											<span className="flex items-center">
												<TrendingUp className="h-3 w-3 mr-1 text-gray-400" />
												{item.helpful.length}
											</span>
											<span className="flex items-center">
												<Eye className="h-3 w-3 mr-1 text-gray-400" />
												{item.views}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="bg-black text-white py-14">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-gradient-to-r from-gray-900 to-black p-6 sm:p-8 rounded-xl border border-gray-800 text-center">
						<h2 className="text-2xl font-bold mb-3">
							Ready to contribute?
						</h2>
						<p className="text-gray-300 text-base mb-6 max-w-2xl mx-auto">
							Share your interview experience or start a
							discussion to help others in their career journey
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link
								to="/experience/new"
								className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
							>
								<Book className="h-4 w-4 mr-1.5" />
								Share Experience
							</Link>
							<Link
								to="/discussion/new"
								className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors inline-flex items-center justify-center border border-gray-700"
							>
								<MessageSquare className="h-4 w-4 mr-1.5" />
								Start Discussion
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default IndexPage;
