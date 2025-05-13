import React, {  useContext, useEffect, useState } from "react";
import { Menu, X, ShieldUser } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeItem, setActiveItem] = useState("Home");
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		handleGetUser();
	}, []);

	const handleGetUser = async () => {
		try {
			const response = await axios.get("/user/auth/getUser", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setUser(response.data.user);
				console.log(response.data.user);
			}
		} catch (err) {
			console.error("Error fetching user data:", err.message);
		}
	};

	const handleLogout = async () => {
		const response = await axios.post("/user/auth/logout", {
			withCredentials: true,
		});
		if (response.status === 200) {
			setUser(null);
			toast.success("Logged out successfully");
		}
	};

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleItemClick = (item) => {
		setActiveItem(item);
	};

	return (
		<nav className="bg-white shadow-md relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16">
					{/* Logo */}
					<div className="flex-shrink-0 flex items-center">
						<Link
							to={"/"}
							className="text-xl font-bold text-black"
							onClick={() => handleItemClick("Home")}
						>
							InterviewInsights
						</Link>
					</div>

					{/* Centered Desktop Navigation */}
					<div className="hidden md:flex flex-1 justify-center items-center">
						<div className="flex space-x-8">
							<Link
								to={"/"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Home"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Home")}
							>
								Home
							</Link>
							<Link
								to={"/companies"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Companies"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Companies")}
							>
								Companies
							</Link>
							<Link
								to={"/discussion"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Discussion"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Discussion")}
							>
								Discussion
							</Link>
							<Link
								to={"/resources"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Resources"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Resources")}
							>
								Resources
							</Link>
							<Link
								to={"/experience"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Experience"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Experience")}
							>
								Experience
							</Link>
							<Link
								to={"/jobs"}
								className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
									activeItem === "Jobs"
										? "border-b-2 border-black text-gray-900"
										: "text-gray-500 hover:text-gray-900"
								}`}
								onClick={() => handleItemClick("Jobs")}
							>
								Jobs
							</Link>
						</div>
					</div>

					{/* Login/Register Buttons (Desktop) */}
					{!user && (
						<div className="hidden md:flex items-center">
							<Link
								to={"/login"}
								className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
							>
								Login
							</Link>
							<Link
								to={"/register"}
								className="ml-2 px-3 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
							>
								Register
							</Link>
						</div>
					)}

					{user && (
						<div className="hidden md:flex items-center">
							{user.role === "admin" && (
								<Link
									to={"/dashboard"}
									className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
								>
									<ShieldUser size={20}/>
								</Link>
							)}
							<Link
								to={`/profile/${user.id}`}
								className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
							>
								{user.name}
							</Link>
							<Link
								onClick={handleLogout}
								className="ml-2 px-3 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
							>
								Logout
							</Link>
						</div>
					)}

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
				<div className="md:hidden absolute w-full bg-white shadow-lg z-50">
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
								activeItem === "Experience"
									? "bg-gray-100 border-l-4 border-black text-gray-900"
									: "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
							onClick={() => handleItemClick("Experience")}
						>
							Experience
						</a>
					</div>
					<div className="pt-4 pb-3 border-t border-gray-200">
						{!user && (
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<Link
										to={"/login"}
										className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black"
									>
										Login
									</Link>
								</div>
								<div className="ml-3">
									<Link
										to={"register"}
										className="block px-3 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800"
									>
										Register
									</Link>
								</div>
							</div>
						)}
						{user && (
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<Link className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black">
										{user.name}
									</Link>
								</div>
								<div className="ml-3">
									<Link
										onClick={handleLogout}
										className="block px-3 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800"
									>
										Logout
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Header;
