import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeItem, setActiveItem] = useState("Home");

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleItemClick = (item) => {
		setActiveItem(item);
	};

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16">
					{/* Logo */}
					<div className="flex-shrink-0 flex items-center">
						<span className="text-xl font-bold text-black">
							Interview Experience
						</span>
					</div>

					{/* Centered Desktop Navigation */}
					<div className="hidden md:flex flex-1 justify-center items-center">
						<div className="flex space-x-8">
							<a
								href="#"
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Home"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Home")}
							>
								Home
							</a>
							<a
								href="#"
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Companies"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Companies")}
							>
								Companies
							</a>
							<a
								href="#"
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Discussion"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Discussion")}
							>
								Discussion
							</a>
							<a
								href="#"
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Resources"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Resources")}
							>
								Resources
							</a>
							<a
								href="#"
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Job board"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Job board")}
							>
								Job board
							</a>
						</div>
					</div>

					{/* Login/Register Buttons (Desktop) */}
					<div className="hidden md:flex items-center">
						<a
							href="#"
							className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
						>
							Login
						</a>
						<a
							href="#"
							className="ml-2 px-3 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
						>
							Register
						</a>
					</div>

					{/* Mobile menu button */}
					<div className="flex items-center ml-auto md:hidden">
						<button
							onClick={toggleMenu}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
						>
							<span className="sr-only">Open main menu</span>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden">
					<div className="pt-2 pb-3 space-y-1">
						<a
							href="#"
							className={`block pl-3 pr-4 py-2 text-base font-medium ${
								activeItem === "Home"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Home")}
						>
							Home
						</a>
						<a
							href="#"
							className={`block pl-3 pr-4 py-2 text-base font-medium ${
								activeItem === "Companies"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Companies")}
						>
							Companies
						</a>
						<a
							href="#"
							className={`block pl-3 pr-4 py-2 text-base font-medium ${
								activeItem === "Discussion"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Discussion")}
						>
							Discussion
						</a>
						<a
							href="#"
							className={`block pl-3 pr-4 py-2 text-base font-medium ${
								activeItem === "Resources"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Resources")}
						>
							Resources
						</a>
						<a
							href="#"
							className={`block pl-3 pr-4 py-2 text-base font-medium ${
								activeItem === "Job board"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Job board")}
						>
							Job board
						</a>
					</div>
					<div className="pt-4 pb-3 border-t border-gray-200">
						<div className="flex items-center px-4">
							<div className="flex-shrink-0">
								<a
									href="#"
									className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black"
								>
									Login
								</a>
							</div>
							<div className="ml-3">
								<a
									href="#"
									className="block px-3 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800"
								>
									Register
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
