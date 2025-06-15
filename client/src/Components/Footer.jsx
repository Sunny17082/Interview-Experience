import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div>
			<footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
						<div>
							<h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">
								Browse
							</h3>
							<ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
								<li>
									<Link
										to={"/experience"}
										className="hover:text-white transition-colors"
									>
										Recent Interviews
									</Link>
								</li>
								<li>
									<Link
										to={"/companies"}
										className="hover:text-white transition-colors"
									>
										Top Companies
									</Link>
								</li>
								<li>
									<Link
										to={"/companies"}
										className="hover:text-white transition-colors"
									>
										Popular Roles
									</Link>
								</li>
								<li>
									<Link
										to={"/experience"}
										className="hover:text-white transition-colors"
									>
										Success Stories
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">
								Resources
							</h3>
							<ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
								<li>
									<Link
										to={"/resources"}
										className="hover:text-white transition-colors"
									>
										Interview Prep
									</Link>
								</li>
								<li>
									<Link
										to={"/companies"}
										href="#"
										className="hover:text-white transition-colors"
									>
										Salary Data
									</Link>
								</li>
								<li>
									<Link
										to={"/discussion"}
										className="hover:text-white transition-colors"
									>
										Career Advice
									</Link>
								</li>
								<li>
									<Link
										to={"/companies"}
										className="hover:text-white transition-colors"
									>
										Company
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">
								Company
							</h3>
							<ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">
								Legal
							</h3>
							<ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Cookie Policy
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-xs sm:text-sm text-center">
						© {new Date().getFullYear()} InterviewInsights. All
						rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
