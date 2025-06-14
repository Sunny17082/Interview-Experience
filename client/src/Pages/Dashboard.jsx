import { useContext, useEffect, useState } from "react";
import {
	Menu,
	X,
	Search,
	Users,
	Home,
	Briefcase,
	MessageSquare,
	BookOpen,
	Building,
	Send,
	Edit,
	Trash,
	Check,
	LogOut,
	X as XIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import { toast } from "react-toastify";

const Dashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [emailModalOpen, setEmailModalOpen] = useState(false);
	const [emailMessage, setEmailMessage] = useState("");
	const [emailSubject, setEmailSubject] = useState(""); // New state for email subject
	const [roleFilter, setRoleFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [userSearchBy, setUserSearchBy] = useState("name");
	const [companySearchTerm, setCompanySearchTerm] = useState("");
	const [loggedInUser, setLoggedInUser] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteExperienceId, setDeleteExperienceId] = useState(null);

	const [companies, setCompanies] = useState([]);
	const [users, setUsers] = useState([]);
	const [reportedContent, setReportedContent] = useState([]);
	// Track which role is being edited for which user
	const [editingRoleForUser, setEditingRoleForUser] = useState(null);
	const [tempRole, setTempRole] = useState("");
	const roles = ["user", "admin"];
	const [stats, setStats] = useState({
		users: 0,
		discussions: 0,
		experiences: 0,
		resources: 0,
		jobs: 0,
		companies: 0,
	});

	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user || user?.role !== "admin") {
			navigate("/");
		}
		setLoggedInUser(user);
	}, [user, navigate]);

	useEffect(() => {
		if (activeTab === "overview") {
			getDashboardData();
		} else if (activeTab === "users") {
			getUser();
		} else if (activeTab === "companies") {
			getCompany();
		} else if (activeTab === "reported") {
			getReportedContent();
		}
	}, [activeTab]);

	const getReportedContent = async () => {
		try {
			// Change the endpoint to match your backend route
			const response = await axios.get("/experience/reported", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setReportedContent(response.data.data);
			}
		} catch (err) {
			console.error("Error fetching reported content:", err);
		}
	};

	const getCompany = async () => {
		try {
			const response = await axios.get("/company", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setCompanies(response.data.companyDoc);
			}
		} catch (err) {
			console.error("Error fetching companies:", err);
		}
	};

	const getUser = async () => {
		try {
			const response = await axios.get("/user/auth/getAllUser", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setUsers(response.data.data);
			}
		} catch (err) {
			console.error("Error fetching users:", err);
		}
	};

	const getDashboardData = async () => {
		try {
			const response = await axios.get("/user/auth/dashboard", {
				withCredentials: true,
			});
			if (response.status === 200) {
				setStats(response.data.data);
			}
		} catch (err) {
			console.error("Error fetching users:", err);
		}
	};

	const handleDeleteExperience = async () => {
		const id = deleteExperienceId;
		const response = await axios.delete(`/experience/${id}`, {
			withCredentials: true,
		});
		if (response.status === 200) {
			toast.success("Experience deleted successfully.");
		}
		setShowDeleteModal(false);
		setDeleteExperienceId(null);
		getReportedContent();
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleUserSelect = (userId) => {
		if (selectedUsers.includes(userId)) {
			setSelectedUsers(selectedUsers.filter((id) => id !== userId));
		} else {
			setSelectedUsers([...selectedUsers, userId]);
		}
	};

	const startEditingRole = (userId, currentRole) => {
		setEditingRoleForUser(userId);
		setTempRole(currentRole);
	};

	const cancelRoleEdit = () => {
		setEditingRoleForUser(null);
		setTempRole("");
	};

	const submitRoleChange = async (userId) => {
		if (!user) {
			toast.error("Please login to submit your experience.");
			return;
		}
		if (user && user.isVerified === false) {
			toast.error("Please verify your email before submitting.");
			return;
		}
		if (user && user.role !== "admin") {
			toast.error("You are not authorized to perform this action.");
			return;
		}
		try {
			const response = await axios.post(
				`/user/auth/role/${userId}`,
				{ role: tempRole },
				{ withCredentials: true }
			);

			if (response.status === 200) {
				// Update the role in our local state
				const updatedUsers = users.map((user) => {
					if (user._id === userId) {
						return { ...user, role: tempRole };
					}
					return user;
				});

				// Update the state with the new users array
				setUsers(updatedUsers);
				setEditingRoleForUser(null);
				setTempRole("");
			}
		} catch (err) {
			console.error("Error updating role:", err);
			// Show error message to user
			alert("Failed to update role. Please try again.");
		}
	};

	const handleListExperience = async (experienceId) => {
		try {
			// Change the endpoint to match your backend route
			const response = await axios.post(
				`/experience/list/${experienceId}`,
				{},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				alert("Experience has been relisted successfully!");
				// Refresh the reported content
				getReportedContent();
			}
		} catch (err) {
			console.error("Error listing experience:", err);
			alert("Failed to list experience. Please try again.");
		}
	};

	const filteredUsers = users.filter((user) => {
		let matchesRole = roleFilter === "all" || user.role === roleFilter;

		let matchesSearch = true;
		if (searchTerm) {
			switch (userSearchBy) {
				case "name":
					matchesSearch = user.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
					break;
				case "email":
					matchesSearch = user.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
					break;
				case "cId":
					matchesSearch = user.cId
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
					break;
			}
		}

		return matchesRole && matchesSearch;
	});

	const filteredCompanies = companies.filter((company) => {
		return companySearchTerm
			? company.name
					.toLowerCase()
					.includes(companySearchTerm.toLowerCase())
			: true;
	});

	const openEmailModal = () => {
		if (selectedUsers.length > 0) {
			setEmailModalOpen(true);
		}
	};

	const sendEmail = async () => {
		try {
			// Send email using the backend API with subject and content
			const response = await axios.post(
				"/user/auth/bulkEmail", // Update this with your actual endpoint
				{
					userIds: selectedUsers,
					subject: emailSubject,
					content: emailMessage,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				alert("Emails sent successfully!");
			}
		} catch (err) {
			console.error("Error sending emails:", err);
			alert("Failed to send emails. Please try again.");
		}

		// Close modal and reset fields
		setEmailModalOpen(false);
		setEmailSubject("");
		setEmailMessage("");
	};

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<div
				className={`bg-black text-white ${
					sidebarOpen ? "w-64" : "w-16"
				} transition-all duration-300 flex flex-col`}
			>
				<div className="flex items-center justify-between p-4">
					{sidebarOpen && (
						<h1 className="text-xl font-bold">Admin Panel</h1>
					)}
					<button
						onClick={toggleSidebar}
						className="p-1 rounded-md hover:bg-gray-700"
					>
						{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>

				<nav className="flex-1 mt-6">
					<ul>
						<li>
							<button
								onClick={() => setActiveTab("overview")}
								className={`flex items-center w-full p-4 ${
									activeTab === "overview"
										? "bg-gray-800"
										: "hover:bg-gray-800"
								}`}
							>
								<Home size={20} />
								{sidebarOpen && (
									<span className="ml-4">Overview</span>
								)}
							</button>
						</li>
						<li>
							<button
								onClick={() => setActiveTab("users")}
								className={`flex items-center w-full p-4 ${
									activeTab === "users"
										? "bg-gray-800"
										: "hover:bg-gray-800"
								}`}
							>
								<Users size={20} />
								{sidebarOpen && (
									<span className="ml-4">
										User Management
									</span>
								)}
							</button>
						</li>
						<li>
							<button
								onClick={() => setActiveTab("companies")}
								className={`flex items-center w-full p-4 ${
									activeTab === "companies"
										? "bg-gray-800"
										: "hover:bg-gray-800"
								}`}
							>
								<Building size={20} />
								{sidebarOpen && (
									<span className="ml-4">Companies</span>
								)}
							</button>
						</li>
						<li>
							<button
								onClick={() => setActiveTab("reported")}
								className={`flex items-center w-full p-4 ${
									activeTab === "reported"
										? "bg-gray-800"
										: "hover:bg-gray-800"
								}`}
							>
								<MessageSquare size={20} />
								{sidebarOpen && (
									<span className="ml-4">
										Reported Content
									</span>
								)}
							</button>
						</li>
						<li>
							<Link
								to="/"
								className="flex items-center w-full p-4 hover:bg-gray-800"
							>
								<LogOut size={20} />
								{sidebarOpen && (
									<span className="ml-4">
										Return to Homepage
									</span>
								)}
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<header className="bg-white shadow">
					<div className="px-6 py-4">
						<h2 className="text-2xl font-bold text-gray-800">
							{activeTab === "overview" && "Dashboard Overview"}
							{activeTab === "users" && "User Management"}
							{activeTab === "companies" && "Company Management"}
							{activeTab === "reported" && "Reported Content"}
						</h2>
					</div>
				</header>

				<main className="p-6">
					{/* Overview Tab */}
					{activeTab === "overview" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<Users
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Total Users
										</p>
										<p className="text-2xl font-semibold">
											{stats.users}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<MessageSquare
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Discussions
										</p>
										<p className="text-2xl font-semibold">
											{stats.discussions}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<BookOpen
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Experiences
										</p>
										<p className="text-2xl font-semibold">
											{stats.experiences}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<BookOpen
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Resources
										</p>
										<p className="text-2xl font-semibold">
											{stats.resources}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<Briefcase
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Jobs
										</p>
										<p className="text-2xl font-semibold">
											{stats.jobs}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-gray-100">
										<Building
											size={24}
											className="text-gray-600"
										/>
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-500">
											Companies
										</p>
										<p className="text-2xl font-semibold">
											{stats.companies}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Users Tab */}
					{activeTab === "users" && (
						<div className="bg-white rounded-lg shadow">
							<div className="p-6 border-b border-gray-200">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div className="flex flex-col md:flex-row gap-4">
										<div className="relative">
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
												<Search
													size={16}
													className="text-gray-400"
												/>
											</div>
											<input
												type="text"
												className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
												placeholder="Search..."
												value={searchTerm}
												onChange={(e) =>
													setSearchTerm(
														e.target.value
													)
												}
											/>
										</div>

										<select
											className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
											value={userSearchBy}
											onChange={(e) =>
												setUserSearchBy(e.target.value)
											}
										>
											<option value="name">
												Search by Name
											</option>
											<option value="email">
												Search by Email
											</option>
											<option value="cId">
												Search by College Id
											</option>
										</select>

										<select
											className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
											value={roleFilter}
											onChange={(e) =>
												setRoleFilter(e.target.value)
											}
										>
											<option value="all">
												All Roles
											</option>
											<option value="user">User</option>
											<option value="admin">Admin</option>
										</select>
									</div>

									<button
										onClick={openEmailModal}
										disabled={selectedUsers.length === 0}
										className={`flex items-center px-4 py-2 font-medium rounded-md ${
											selectedUsers.length > 0
												? "bg-black text-white hover:bg-gray-800"
												: "bg-gray-200 text-gray-500 cursor-not-allowed"
										}`}
									>
										<Send size={16} className="mr-2" />
										Send Email ({selectedUsers.length})
									</button>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												<input
													type="checkbox"
													className="h-4 w-4"
													onChange={(e) => {
														if (e.target.checked) {
															setSelectedUsers(
																filteredUsers.map(
																	(user) =>
																		user._id
																)
															);
														} else {
															setSelectedUsers(
																[]
															);
														}
													}}
													checked={
														filteredUsers.length >
															0 &&
														selectedUsers.length ===
															filteredUsers.length
													}
												/>
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Email
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												College Id
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Role
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredUsers.map((user) => (
											<tr key={user._id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<input
														type="checkbox"
														className="h-4 w-4"
														checked={selectedUsers.includes(
															user._id
														)}
														onChange={() =>
															handleUserSelect(
																user._id
															)
														}
													/>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{user.name}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{user.email}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{user.cId}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{editingRoleForUser ===
													user._id ? (
														<div className="flex items-center space-x-2">
															<select
																value={tempRole}
																onChange={(e) =>
																	setTempRole(
																		e.target
																			.value
																	)
																}
																className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
																autoFocus
															>
																{roles.map(
																	(role) => (
																		<option
																			key={
																				role
																			}
																			value={
																				role
																			}
																		>
																			{
																				role
																			}
																		</option>
																	)
																)}
															</select>
															<button
																onClick={() =>
																	submitRoleChange(
																		user._id
																	)
																}
																className="p-1 text-green-600 hover:text-green-800 focus:outline-none"
																title="Save"
															>
																<Check
																	size={16}
																/>
															</button>
															<button
																onClick={
																	cancelRoleEdit
																}
																className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
																title="Cancel"
															>
																<XIcon
																	size={16}
																/>
															</button>
														</div>
													) : (
														<div className="flex items-center">
															<span
																className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2
                                ${
									user.role === "admin"
										? "bg-gray-100 text-gray-800"
										: "bg-gray-200 text-gray-800"
								}`}
															>
																{user.role}
															</span>
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													{loggedInUser &&
														loggedInUser.email !==
															user.email && (
															<div className="flex items-center space-x-2">
																{editingRoleForUser !==
																	user._id && (
																	<button
																		onClick={() =>
																			startEditingRole(
																				user._id,
																				user.role
																			)
																		}
																		className="text-gray-600 hover:text-gray-900 focus:outline-none"
																	>
																		<Edit
																			size={
																				16
																			}
																		/>
																	</button>
																)}
																<button className="text-gray-600 hover:text-red-600 focus:outline-none">
																	<Trash
																		size={
																			16
																		}
																	/>
																</button>
															</div>
														)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Companies Tab */}
					{activeTab === "companies" && (
						<div className="bg-white rounded-lg shadow">
							<div className="p-6 border-b border-gray-200">
								<div className="flex justify-between items-center">
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<Search
												size={16}
												className="text-gray-400"
											/>
										</div>
										<input
											type="text"
											className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
											placeholder="Search companies..."
											value={companySearchTerm}
											onChange={(e) =>
												setCompanySearchTerm(
													e.target.value
												)
											}
										/>
									</div>

									<Link
										to={"/company/new"}
										className="px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800"
									>
										+ Add Company
									</Link>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Number of Roles
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredCompanies.map((company) => (
											<tr key={company._id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{company.name}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{company.roles.length}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<Link
														to={`/company/edit/${company._id}`}
													>
														<button className="text-gray-600 hover:text-gray-900 mr-3">
															<Edit size={16} />
														</button>
													</Link>
													<button className="text-gray-600 hover:text-red-600">
														<Trash size={16} />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === "reported" && (
						<div className="bg-white rounded-lg shadow">
							<div className="p-6 border-b border-gray-200">
								<h3 className="text-lg font-semibold">
									Reported Experiences
								</h3>
							</div>

							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Company Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Role
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Author Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Report Reason
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Report Count
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{reportedContent.map((report) => (
											<tr key={report._id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{report.companyName ||
															"N/A"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{report.role || "N/A"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{report.authorName ||
															"N/A"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{report.reason || "N/A"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
														{report.reportCount ||
															0}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<button
														onClick={() =>
															handleListExperience(
																report._id
															)
														}
														className="text-blue-600 hover:text-blue-900 mr-3"
													>
														List It
													</button>
													<button
														onClick={() => {
															setShowDeleteModal(true)
															setDeleteExperienceId(
																report._id
															);
														}
														}
														className="text-red-600 hover:text-red-900"
													>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</main>
			</div>

			{/* Email Modal */}
			{emailModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">Send Email</h2>
						<p className="text-sm text-gray-600 mb-4">
							Sending email to {selectedUsers.length} selected
							user(s)
						</p>

						{/* Subject Field */}
						<input
							type="text"
							className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
							placeholder="Email subject"
							value={emailSubject}
							onChange={(e) => setEmailSubject(e.target.value)}
						/>

						<textarea
							className="w-full p-2 border border-gray-300 rounded-md mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-gray-500"
							placeholder="Enter your message here..."
							value={emailMessage}
							onChange={(e) => setEmailMessage(e.target.value)}
						></textarea>

						<div className="flex justify-end gap-4">
							<button
								onClick={() => setEmailModalOpen(false)}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={sendEmail}
								className="px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800"
								disabled={!emailSubject || !emailMessage}
							>
								Send
							</button>
						</div>
					</div>
				</div>
			)}
			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteExperience}
				itemName="interview experience"
			/>
		</div>
	);
};

export default Dashboard;
