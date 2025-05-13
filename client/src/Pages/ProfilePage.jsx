import { useContext, useState, useEffect, useCallback } from "react";
import {
	Camera,
	Edit,
	Save,
	Mail,
	User,
	Calendar,
	Shield,
	School,
	Lock,
	Check,
	Briefcase,
	MessageSquare,
	Book,
	Search,
	Upload,
} from "lucide-react";
import { UserContext } from "../UserContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
	// Changed from user to userData
	const [userData, setUserData] = useState({});
	const [userContent, setUserContent] = useState({
		discussions: [],
		experiences: [],
		resources: [],
	});

	const { id } = useParams();

	const { user } = useContext(UserContext);

	const [isEditing, setIsEditing] = useState(false);
	const [editableUser, setEditableUser] = useState({ ...userData });
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState("discussions");

	// Add state for profile and cover image previews
	const [profileImgPreview, setProfileImgPreview] = useState(null);
	const [coverImgPreview, setCoverImgPreview] = useState(null);
	const [profileImgFile, setProfileImgFile] = useState(null);
	const [coverImgFile, setCoverImgFile] = useState(null);

	// States for drag and drop functionality
	const [isDraggingProfile, setIsDraggingProfile] = useState(false);
	const [isDraggingCover, setIsDraggingCover] = useState(false);

	// Check if logged in user is viewing their own profile
	const isOwnProfile = user?.id === userData?._id;

	useEffect(() => {
		getUserData();
	}, [id]);

	const getUserData = async () => {
		try {
			const response = await axios.get(`user/auth/profile/${id}`, {
				withCredentials: true,
			});

			if (response.data.success) {
				setUserData(response.data.data.userDoc);
				setUserContent({
					discussions: response.data.data.discussionDoc,
					experiences: response.data.data.experienceDoc,
					resources: response.data.data.resourceDoc,
				});
				setEditableUser(response.data.data.userDoc);

				// Reset image previews when fetching user data
				setProfileImgPreview(
					response.data.data.userDoc.profileImg || null
				);
				setCoverImgPreview(response.data.data.userDoc.coverImg || null);
			}
		} catch (err) {
			console.error("Error fetching user data:", err);
		}
	};

	const handleEditToggle = async () => {
		if (isEditing) {
			try {
				// Create form data to send to server
				const formData = new FormData();

				// Add basic user data - only send changed fields
				for (const key in editableUser) {
					if (
						key !== "profileImg" &&
						key !== "coverImg" &&
						editableUser[key] !== userData[key]
					) {
						formData.append(key, editableUser[key]);
					}
				}

				// Add profile image if changed
				if (profileImgFile) {
					formData.append("profileImg", profileImgFile);
				}

				// Add cover image if changed
				if (coverImgFile) {
					formData.append("coverImg", coverImgFile);
				}

				// Only send request if there are changes
				if ([...formData.entries()].length > 0) {
					// Submit form data to update profile
					const response = await axios.put(
						`user/auth/profile/${id}`,
						formData,
						{
							withCredentials: true,
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					);
					if (response.data.success) {
						// Update user data with server response
						setUserData(response.data.data);
						setEditableUser(response.data.data);

						// Reset file states
						setProfileImgFile(null);
						setCoverImgFile(null);
						setIsEditing(!isEditing);

						// Show success message
						toast.success("Profile updated successfully!");
					} else {
						toast.error(
							"Failed to update profile: " + response.data.message
						);
					}
				}
			} catch (err) {
				console.error("Error updating profile:", err);
				toast.error("Failed to update profile. Please try again.");
			}
		}

		// Toggle editing state regardless of save outcome
		setIsEditing(!isEditing);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditableUser((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle profile image changes (file input)
	const handleProfileImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			processProfileImage(file);
		}
	};

	// Handle cover image changes (file input)
	const handleCoverImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			processCoverImage(file);
		}
	};

	// Process profile image (shared between click upload and drag & drop)
	const processProfileImage = (file) => {
		setProfileImgFile(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setProfileImgPreview(reader.result);
		};
		reader.readAsDataURL(file);
		setIsDraggingProfile(false);
	};

	// Process cover image (shared between click upload and drag & drop)
	const processCoverImage = (file) => {
		setCoverImgFile(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setCoverImgPreview(reader.result);
		};
		reader.readAsDataURL(file);
		setIsDraggingCover(false);
	};

	// Drag & Drop handlers for profile image
	const handleProfileDragEnter = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				setIsDraggingProfile(true);
			}
		},
		[isEditing, isOwnProfile]
	);

	const handleProfileDragLeave = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDraggingProfile(false);
	}, []);

	const handleProfileDragOver = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				setIsDraggingProfile(true);
			}
		},
		[isEditing, isOwnProfile]
	);

	const handleProfileDrop = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				const file = e.dataTransfer.files[0];
				if (file && file.type.startsWith("image/")) {
					processProfileImage(file);
				} else {
					toast.error("Please drop an image file.");
					setIsDraggingProfile(false);
				}
			}
		},
		[isEditing, isOwnProfile]
	);

	// Drag & Drop handlers for cover image
	const handleCoverDragEnter = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				setIsDraggingCover(true);
			}
		},
		[isEditing, isOwnProfile]
	);

	const handleCoverDragLeave = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDraggingCover(false);
	}, []);

	const handleCoverDragOver = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				setIsDraggingCover(true);
			}
		},
		[isEditing, isOwnProfile]
	);

	const handleCoverDrop = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isEditing && isOwnProfile) {
				const file = e.dataTransfer.files[0];
				if (file && file.type.startsWith("image/")) {
					processCoverImage(file);
				} else {
					toast.error("Please drop an image file.");
					setIsDraggingCover(false);
				}
			}
		},
		[isEditing, isOwnProfile]
	);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleVerifyAccount = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"/user/resend-verification",
				{ email: userData.email },
				{
					withCredentials: true,
				}
			);
			if (response.data.success) {
				toast.success(
					"Verification email sent successfully! Please check your inbox."
				);
			}
		} catch (error) {
			toast.error("Failed to send verification email. Please try again.");
			console.error("Error sending verification email:", error);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post("/user/forgot-password", {
				email: userData.email,
			});

			if (response.data.success) {
				toast.success(
					"Password reset link sent successfully! Please check your email."
				);
			}
		} catch (error) {
			toast.error(
				"Failed to send password reset link. Please try again."
			);
			console.error("Error sending password reset link:", error);
		}
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	// Filter content based on search term
	const filteredContent = {
		discussions: userContent.discussions.filter((item) =>
			item?.title?.toLowerCase().includes(searchTerm)
		),
		experiences: userContent.experiences.filter((item) =>
			item?.companyName?.toLowerCase().includes(searchTerm)
		),
		resources: userContent.resources.filter((item) =>
			item?.title?.toLowerCase().includes(searchTerm)
		),
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-5xl mx-auto py-8 px-4">
				{/* Main Card */}
				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					{/* Cover Image */}
					<div
						className={`relative h-56 ${
							isEditing && isOwnProfile ? "cursor-pointer" : ""
						} ${isDraggingCover ? "bg-black bg-opacity-50" : ""}`}
						onDragEnter={handleCoverDragEnter}
						onDragOver={handleCoverDragOver}
						onDragLeave={handleCoverDragLeave}
						onDrop={handleCoverDrop}
					>
						{coverImgPreview || userData.coverImg ? (
							<img
								src={coverImgPreview || userData.coverImg}
								alt="Cover"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
						)}

						{/* Drag & Drop Overlay for Cover */}
						{isEditing && isOwnProfile && (
							<div
								className={`absolute inset-0 flex items-center justify-center transition-opacity ${
									isDraggingCover
										? "opacity-100"
										: "opacity-0"
								} bg-black bg-opacity-70`}
							>
								<div className="text-center text-white">
									<Upload
										size={32}
										className="mx-auto mb-2"
									/>
									<p className="font-medium">
										Drop image here
									</p>
								</div>
							</div>
						)}

						{/* Cover Image Edit Button - Only shown in edit mode */}
						{isOwnProfile && isEditing && (
							<div className="absolute bottom-4 right-4">
								<label
									htmlFor="coverImg"
									className="cursor-pointer bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition duration-200 flex items-center justify-center"
								>
									<Camera size={16} />
									<input
										type="file"
										id="coverImg"
										accept="image/*"
										onChange={handleCoverImageChange}
										className="hidden"
									/>
								</label>
							</div>
						)}

						{/* Edit Profile Button - Only shown if it's the user's own profile */}
						{isOwnProfile && (
							<button
								onClick={handleEditToggle}
								className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition duration-200 flex items-center"
							>
								{isEditing ? (
									<Save size={16} className="mr-2" />
								) : (
									<Edit size={16} className="mr-2" />
								)}
								{isEditing ? "Save" : "Edit Profile"}
							</button>
						)}
					</div>

					<div className="flex flex-col lg:flex-row">
						{/* Left Column */}
						<div className="w-full lg:w-1/3 px-6 py-6 border-r border-gray-100">
							{/* Profile Image */}
							<div className="flex justify-center lg:justify-start -mt-20 mb-6 relative">
								<div
									className={`relative ${
										isEditing && isOwnProfile
											? "cursor-pointer"
											: ""
									}`}
									onDragEnter={handleProfileDragEnter}
									onDragOver={handleProfileDragOver}
									onDragLeave={handleProfileDragLeave}
									onDrop={handleProfileDrop}
								>
									<div className="w-36 h-36 bg-white rounded-full p-1 shadow-lg">
										<div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
											{profileImgPreview ||
											userData.profileImg ? (
												<img
													src={
														profileImgPreview ||
														userData.profileImg
													}
													alt={userData.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<User
													size={64}
													className="text-gray-400"
												/>
											)}
										</div>
									</div>

									{/* Drag & Drop Overlay for Profile */}
									{isEditing && isOwnProfile && (
										<div
											className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity ${
												isDraggingProfile
													? "opacity-100"
													: "opacity-0"
											} bg-black bg-opacity-70`}
										>
											<div className="text-center text-white">
												<Upload
													size={24}
													className="mx-auto"
												/>
											</div>
										</div>
									)}

									{/* Profile Image Edit Button - Only shown in edit mode */}
									{isOwnProfile && isEditing && (
										<div className="absolute bottom-1 right-1">
											<label
												htmlFor="profileImg"
												className="cursor-pointer bg-black text-white p-2 rounded-full hover:bg-gray-800 shadow-md transition duration-200 flex items-center justify-center"
											>
												<Camera size={16} />
												<input
													type="file"
													id="profileImg"
													accept="image/*"
													onChange={
														handleProfileImageChange
													}
													className="hidden"
												/>
											</label>
										</div>
									)}
								</div>
							</div>

							{/* User Basic Info */}
							<div className="text-center lg:text-left">
								<h1 className="text-2xl font-bold text-gray-900">
									{userData.name}
								</h1>
								<p className="text-gray-600 flex items-center justify-center lg:justify-start mt-1">
									<Mail size={14} className="mr-1" />
									{userData.email}
								</p>
								<div className="mt-2">
									<span
										className={`px-3 py-1 text-xs rounded-full ${
											userData.isVerified
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{userData.isVerified
											? "Verified Account"
											: "Not Verified"}
									</span>
								</div>
							</div>

							{/* Stats */}
							<div className="mt-8">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Activity
								</h3>
								<div className="bg-gray-50 rounded-xl p-4">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center">
											<div className="bg-gray-200 p-2 rounded-lg mr-3">
												<Briefcase
													size={18}
													className="text-gray-700"
												/>
											</div>
											<span className="text-gray-700">
												Experiences
											</span>
										</div>
										<span className="font-bold text-gray-900">
											{userContent.experiences.length}
										</span>
									</div>
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center">
											<div className="bg-gray-200 p-2 rounded-lg mr-3">
												<MessageSquare
													size={18}
													className="text-gray-700"
												/>
											</div>
											<span className="text-gray-700">
												Discussions
											</span>
										</div>
										<span className="font-bold text-gray-900">
											{userContent.discussions.length}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<div className="bg-gray-200 p-2 rounded-lg mr-3">
												<Book
													size={18}
													className="text-gray-700"
												/>
											</div>
											<span className="text-gray-700">
												Resources
											</span>
										</div>
										<span className="font-bold text-gray-900">
											{userContent.resources.length}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right Column */}
						<div className="w-full lg:w-2/3 px-6 py-6">
							<div className="mb-8">
								<h2 className="text-xl font-bold text-gray-900 mb-4">
									Personal Information
								</h2>
								<div className="space-y-4">
									{/* Name */}
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex flex-col md:flex-row md:items-center">
											<div className="w-full md:w-1/3 flex items-center mb-2 md:mb-0">
												<User
													size={16}
													className="text-gray-500 mr-2"
												/>
												<span className="text-gray-600 font-medium">
													Name
												</span>
											</div>
											<div className="w-full md:w-2/3">
												{isEditing && isOwnProfile ? (
													<input
														type="text"
														name="name"
														value={
															editableUser.name
														}
														onChange={handleChange}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
													/>
												) : (
													<span className="text-gray-900">
														{userData.name}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Email */}
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex flex-col md:flex-row md:items-center">
											<div className="w-full md:w-1/3 flex items-center mb-2 md:mb-0">
												<Mail
													size={16}
													className="text-gray-500 mr-2"
												/>
												<span className="text-gray-600 font-medium">
													Email
												</span>
											</div>
											<div className="w-full md:w-2/3">
												<span className="text-gray-900">
													{userData.email}
												</span>
											</div>
										</div>
									</div>

									{/* College ID */}
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex flex-col md:flex-row md:items-center">
											<div className="w-full md:w-1/3 flex items-center mb-2 md:mb-0">
												<School
													size={16}
													className="text-gray-500 mr-2"
												/>
												<span className="text-gray-600 font-medium">
													College ID
												</span>
											</div>
											<div className="w-full md:w-2/3">
												{isEditing && isOwnProfile ? (
													<input
														type="text"
														name="cId"
														value={
															editableUser.cId ||
															""
														}
														onChange={handleChange}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
													/>
												) : (
													<span className="text-gray-900">
														{userData.cId ||
															"Not set"}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Role */}
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex flex-col md:flex-row md:items-center">
											<div className="w-full md:w-1/3 flex items-center mb-2 md:mb-0">
												<Shield
													size={16}
													className="text-gray-500 mr-2"
												/>
												<span className="text-gray-600 font-medium">
													Role
												</span>
											</div>
											<div className="w-full md:w-2/3">
												<span className="text-gray-900 capitalize">
													{userData.role}
												</span>
											</div>
										</div>
									</div>

									{/* Member Since */}
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex flex-col md:flex-row md:items-center">
											<div className="w-full md:w-1/3 flex items-center mb-2 md:mb-0">
												<Calendar
													size={16}
													className="text-gray-500 mr-2"
												/>
												<span className="text-gray-600 font-medium">
													Member Since
												</span>
											</div>
											<div className="w-full md:w-2/3">
												<span className="text-gray-900">
													{userData.createdAt
														? formatDate(
																userData.createdAt
														  )
														: ""}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons - Only shown if it's the user's own profile */}
							{isOwnProfile && (
								<div className="mt-8">
									<h2 className="text-xl font-bold text-gray-900 mb-4">
										Account Actions
									</h2>
									<div className="flex flex-col sm:flex-row gap-4">
										{!userData.isVerified && (
											<button
												onClick={handleVerifyAccount}
												className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
												disabled={isEditing}
											>
												<Check
													size={18}
													className="mr-2"
												/>
												Verify Account
											</button>
										)}

										<button
											onClick={handleResetPassword}
											className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
											disabled={isEditing}
										>
											<Lock size={18} className="mr-2" />
											Reset Password
										</button>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* User Content Section - TABBED INTERFACE */}
					<div className="border-t border-gray-100 px-6 py-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold text-gray-900">
								Content by {userData.name}
							</h2>
							<div className="relative">
								<input
									type="text"
									placeholder="Search content..."
									value={searchTerm}
									onChange={handleSearch}
									className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								/>
								<Search
									className="absolute left-3 top-2.5 text-gray-400"
									size={16}
								/>
							</div>
						</div>

						{/* Tabs Navigation */}
						<div className="flex border-b border-gray-200 mb-6">
							<button
								onClick={() => setActiveTab("discussions")}
								className={`flex items-center py-3 px-4 font-medium text-sm transition-colors duration-200 ${
									activeTab === "discussions"
										? "text-black border-b-2 border-black"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								<MessageSquare size={16} className="mr-2" />
								Discussions (
								{filteredContent.discussions.length})
							</button>
							<button
								onClick={() => setActiveTab("experiences")}
								className={`flex items-center py-3 px-4 font-medium text-sm transition-colors duration-200 ${
									activeTab === "experiences"
										? "text-black border-b-2 border-black"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								<Briefcase size={16} className="mr-2" />
								Experiences (
								{filteredContent.experiences.length})
							</button>
							<button
								onClick={() => setActiveTab("resources")}
								className={`flex items-center py-3 px-4 font-medium text-sm transition-colors duration-200 ${
									activeTab === "resources"
										? "text-black border-b-2 border-black"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								<Book size={16} className="mr-2" />
								Resources ({filteredContent.resources.length})
							</button>
						</div>

						{/* Tab Content */}
						<div className="mt-4">
							{/* Discussions Tab */}
							{activeTab === "discussions" && (
								<div>
									{filteredContent.discussions.length > 0 ? (
										<div className="space-y-3">
											{filteredContent.discussions.map(
												(discussion) => (
													<Link
														to={`/discussion/${discussion._id}`}
														key={discussion._id}
													>
														<div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
															<h4 className="font-medium text-gray-900">
																{
																	discussion.title
																}
															</h4>
														</div>
													</Link>
												)
											)}
										</div>
									) : (
										<p className="text-gray-500 italic">
											No discussions found.
										</p>
									)}
								</div>
							)}

							{/* Experiences Tab */}
							{activeTab === "experiences" && (
								<div>
									{filteredContent.experiences.length > 0 ? (
										<div className="space-y-3">
											{filteredContent.experiences.map(
												(experience) => (
													<Link
														to={`/experience/${experience._id}`}
														key={experience._id}
													>
														<div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
															<h4 className="font-medium text-gray-900">
																{
																	experience.companyName
																}
															</h4>
														</div>
													</Link>
												)
											)}
										</div>
									) : (
										<p className="text-gray-500 italic">
											No experiences found.
										</p>
									)}
								</div>
							)}

							{/* Resources Tab */}
							{activeTab === "resources" && (
								<div>
									{filteredContent.resources.length > 0 ? (
										<div className="space-y-3">
											{filteredContent.resources.map(
												(resource) => (
													<Link
														to={`/resources`}
														key={resource._id}
													>
														<div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
															<h4 className="font-medium text-gray-900">
																{resource.title}
															</h4>
														</div>
													</Link>
												)
											)}
										</div>
									) : (
										<p className="text-gray-500 italic">
											No resources found.
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
