import React, { useState } from "react";
import {
	Search,
	ChevronRight,
	Briefcase,
	Edit,
	PlusCircle,
	FileText,
	BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const IndexPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const featuredCompanies = [
		{ name: "Amazon", count: "2,453" },
		{ name: "Google", count: "1,892" },
		{ name: "Microsoft", count: "1,756" },
		{ name: "Apple", count: "1,432" },
		{ name: "Meta", count: "1,315" },
	];

	const popularRoles = [
		"Software Engineer",
		"Product Manager",
		"Data Scientist",
		"UX Designer",
	];

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<section className="bg-gray-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-30">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
						<div className="w-full lg:w-1/2 mb-10 lg:mb-0">
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								Real Interview <br />
								<span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
									Experiences
								</span>
							</h1>
							<p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 max-w-xl">
								Learn from thousands of detailed interview
								experiences shared by actual candidates. Prepare
								better. Interview smarter.
							</p>

							<div className="mt-6 md:mt-8 bg-white rounded-lg flex items-center p-2 shadow-lg">
								<input
									type="text"
									placeholder="Search by company, role, or skill..."
									className="flex-1 p-2 md:p-3 bg-transparent focus:outline-none text-gray-900 text-base md:text-lg"
								/>
								<button className="bg-black p-2 md:p-3 rounded-md hover:bg-gray-800 transition-colors flex items-center">
									<Search className="h-5 w-5 text-white" />
								</button>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								{popularRoles.map((role) => (
									<span
										key={role}
										className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full cursor-pointer transition-colors"
									>
										{role}
									</span>
								))}
							</div>
						</div>

						<div className="w-full lg:w-1/2 lg:pl-12">
							<div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl transform transition-all hover:scale-[1.02]">
								<div className="flex items-center mb-6">
									<div className="bg-blue-500/20 p-3 rounded-xl">
										<BookOpen className="h-7 w-7 text-blue-400" />
									</div>
									<div className="ml-4">
										<h3 className="text-xl font-bold text-white">
											Share Your Experience
										</h3>
										<p className="text-sm text-gray-400">
											Help the community grow
										</p>
									</div>
								</div>

								<div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
									<p className="text-sm text-gray-300 mb-4 text-center">
										Your interview journey can provide
										valuable insights for job seekers.
									</p>

									<div className="flex items-center justify-center">
										<Link to={"/experience/new"} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 hover:shadow-lg">
											{/* <PlusCircle className="h-5 w-5" /> */}
											<span>
												Share Interview Experience
											</span>
										</Link>
									</div>
								</div>

								<div className="text-center">
									<p className="text-xs text-gray-500 italic">
										"Every experience shared is a guide for
										someone's future success"
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Companies */}
			<section className="py-10 sm:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center mb-6 sm:mb-8">
						<h2 className="text-xl sm:text-2xl font-bold">
							Featured Companies
						</h2>
						<a
							href="#"
							className="text-xs sm:text-sm font-medium flex items-center hover:text-gray-600"
						>
							View All Companies{" "}
							<ChevronRight className="h-4 w-4 ml-1" />
						</a>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
						{featuredCompanies.map((company) => (
							<div
								key={company.name}
								className="bg-white border border-gray-100 shadow-sm rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex items-center justify-between mb-4">
									<div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
										<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
									</div>
									<span className="text-xs text-gray-500">
										{company.count} interviews
									</span>
								</div>
								<h3 className="font-medium text-sm sm:text-base">
									{company.name}
								</h3>
								<div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
									<span className="text-xs text-gray-500">
										View Interviews
									</span>
									<ChevronRight className="h-4 w-4 text-gray-400" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-10 sm:py-16 bg-black text-white text-center">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 sm:mb-6 text-gray-300" />
					<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
						Share Your Interview Experience
					</h2>
					<p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">
						Help others prepare by sharing your interview journey.
						Your insights could be the key to someone else's
						success.
					</p>
					<button className="bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base">
						Submit Your Experience
					</button>
				</div>
			</section>
		</div>
	);
};

export default IndexPage;
