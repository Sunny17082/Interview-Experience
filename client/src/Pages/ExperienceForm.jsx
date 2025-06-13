import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";

const ExperienceForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(id ? true : false);
	const [error, setError] = useState("");
	const [interviewStatus, setInterviewStatus] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [isOtherCompany, setIsOtherCompany] = useState(false);
	const [role, setRole] = useState("");
	const [name, setName] = useState("");
	const [challengesEncountered, setChallengesEncountered] = useState("");
	const [overallFeedback, setOverallFeedback] = useState("");
	const [packageOffered, setPackageOffered] = useState(0);
	const [rounds, setRounds] = useState([
		{
			number: 1,
			name: "",
			isOtherRoundType: false,
			customRoundName: "",
			questions: [
				{
					topic: "",
					isOtherTopic: false,
					customTopic: "",
					description: "",
					isCodingQuestion: false,
					codingDifficulty: 5,
				},
			],
		},
	]);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const { user } = useContext(UserContext);

	// State for companies fetched from API
	const [companies, setCompanies] = useState([]);
	const [loadingCompanies, setLoadingCompanies] = useState(true);

	const statusOptions = [
		{
			value: "offered",
			label: "Offered",
			bgColor: "bg-gray-100",
			textColor: "text-green-800",
			activeBg: "bg-green-600",
			activeText: "text-white",
		},
		{
			value: "rejected",
			label: "Rejected",
			bgColor: "bg-gray-100",
			textColor: "text-red-800",
			activeBg: "bg-red-600",
			activeText: "text-white",
		},
		{
			value: "in-process",
			label: "In Process",
			bgColor: "bg-gray-100",
			textColor: "text-yellow-800",
			activeBg: "bg-yellow-600",
			activeText: "text-white",
		},
	];

	// Round type options
	const roundTypeOptions = [
		"Online Assessment",
		"Technical",
		"Managerial",
		"HR",
		"Others",
	];

	// Question topic options
	const topicOptions = [
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
		"Others",
	];

	// Fetch companies from API
	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				setLoadingCompanies(true);
				const res = await axios.get("/company", {
					withCredentials: true,
				});

				if (res.data.success) {
					setCompanies(res.data.companyDoc || []);
				} else {
					console.error("Failed to fetch companies");
					// Fallback to empty array if API fails
					setCompanies([]);
				}
			} catch (err) {
				console.error("Error fetching companies:", err);
				// Fallback to empty array if API fails
				setCompanies([]);
			} finally {
				setLoadingCompanies(false);
			}
		};

		fetchCompanies();
	}, []);

	// Fetch existing experience data if ID is provided
	useEffect(() => {
		const fetchExperience = async () => {
			if (id) {
				try {
					setLoading(true);
					const res = await axios.get(`/experience/${id}`, {
						withCredentials: true,
					});

					if (res.data.success) {
						const exp = res.data.experienceDoc;
						setName(exp.name || "");
						setCompanyName(exp.companyName || "");
						// Check if company exists in predefined list
						const foundCompany = companies.find(
							(c) => c.name === exp.companyName
						);
						setIsOtherCompany(!foundCompany);
						setRole(exp.role || "");
						setInterviewStatus(exp.interviewStatus || "");
						setPackageOffered(exp.packageOffered || 0);
						setChallengesEncountered(
							exp.challengesEncountered || ""
						);
						setOverallFeedback(exp.overallFeedback || "");

						// Only set rounds if they exist
						if (exp.rounds && exp.rounds.length > 0) {
							setRounds(
								exp.rounds.map((round, index) => {
									// Check if round name is in predefined options
									const isOtherRoundType =
										!roundTypeOptions.includes(round.name);

									return {
										...round,
										number: index + 1,
										isOtherRoundType,
										customRoundName: isOtherRoundType
											? round.name
											: "",
										name: isOtherRoundType
											? "Others"
											: round.name,
										questions: round.questions.map((q) => {
											// Check if topic is in predefined options
											const isOtherTopic =
												!topicOptions.includes(q.topic);

											return {
												...q,
												isOtherTopic,
												customTopic: isOtherTopic
													? q.topic
													: "",
												topic: isOtherTopic
													? "Others"
													: q.topic,
												codingDifficulty:
													q.codingDifficulty || 5,
											};
										}),
									};
								})
							);
						}
					} else {
						setError("Failed to load experience data");
					}
				} catch (err) {
					console.error("Error fetching experience:", err);
					setError("Failed to load experience data");
				} finally {
					setLoading(false);
				}
			}
		};

		// Only fetch experience if companies are loaded (to avoid issues with company checking)
		if (!loadingCompanies) {
			fetchExperience();
		}
	}, [id, companies, loadingCompanies]);

	const handleCompanyChange = (e) => {
		const selectedValue = e.target.value;
		if (selectedValue === "other") {
			setIsOtherCompany(true);
			setCompanyName("");
		} else {
			setIsOtherCompany(false);
			setCompanyName(selectedValue);
		}
	};

	const getSelectedCompanyLogo = () => {
		const company = companies.find((c) => c.name === companyName);
		return company ? company.logo : null;
	};

	const addRound = () => {
		setRounds([
			...rounds,
			{
				number: rounds.length + 1,
				name: "",
				isOtherRoundType: false,
				customRoundName: "",
				questions: [
					{
						topic: "",
						isOtherTopic: false,
						customTopic: "",
						description: "",
						isCodingQuestion: false,
						codingDifficulty: 5,
					},
				],
			},
		]);
	};

	const updateRound = (roundIndex, field, value) => {
		const newRounds = [...rounds];
		newRounds[roundIndex][field] = value;

		// Handle round type selection
		if (field === "name") {
			if (value === "Others") {
				newRounds[roundIndex].isOtherRoundType = true;
			} else {
				newRounds[roundIndex].isOtherRoundType = false;
				newRounds[roundIndex].customRoundName = "";
			}
		}

		setRounds(newRounds);
	};

	const addQuestion = (roundIndex) => {
		const newRounds = [...rounds];
		newRounds[roundIndex].questions.push({
			topic: "",
			isOtherTopic: false,
			customTopic: "",
			description: "",
			isCodingQuestion: false,
			codingDifficulty: 5,
		});
		setRounds(newRounds);
	};

	const updateQuestion = (roundIndex, questionIndex, field, value) => {
		const newRounds = [...rounds];
		newRounds[roundIndex].questions[questionIndex][field] = value;

		// Handle topic selection
		if (field === "topic") {
			if (value === "Others") {
				newRounds[roundIndex].questions[
					questionIndex
				].isOtherTopic = true;
			} else {
				newRounds[roundIndex].questions[
					questionIndex
				].isOtherTopic = false;
				newRounds[roundIndex].questions[questionIndex].customTopic = "";
			}
		}

		setRounds(newRounds);
	};

	const removeRound = (roundIndex) => {
		const newRounds = rounds
			.filter((_, index) => index !== roundIndex)
			.map((round, index) => ({ ...round, number: index + 1 }));
		setRounds(newRounds);
	};

	const removeQuestion = (roundIndex, questionIndex) => {
		const newRounds = [...rounds];
		newRounds[roundIndex].questions = newRounds[
			roundIndex
		].questions.filter((_, index) => index !== questionIndex);
		setRounds(newRounds);
	};

	const getDifficultyLabel = (difficulty) => {
		switch (true) {
			case difficulty == 1:
				return "Easy";
			case difficulty == 2:
				return "Easy-Medium";
			case difficulty == 3:
				return "Medium";
			case difficulty == 4:
				return "Medium-Hard";
			default:
				return "Hard";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please login to submit your experience.");
			return;
		}
		if (user && user.isVerified === false) {
			toast.error("Please verify your email before submitting.");
			return;
		}

		// Prepare rounds data for submission
		const processedRounds = rounds.map((round) => ({
			...round,
			name: round.isOtherRoundType ? round.customRoundName : round.name,
			questions: round.questions.map((q) => ({
				...q,
				topic: q.isOtherTopic ? q.customTopic : q.topic,
			})),
		}));

		const isValid =
			companyName.trim() !== "" &&
			role.trim() !== "" &&
			interviewStatus !== "" &&
			processedRounds.every((round) => {
				const roundName = round.isOtherRoundType
					? round.customRoundName
					: round.name;
				return (
					roundName.trim() !== "" &&
					round.questions.every((q) => {
						const topicName = q.isOtherTopic
							? q.customTopic
							: q.topic;
						return topicName.trim() !== "";
					})
				);
			});

		if (isValid) {
			const experienceData = {
				name,
				companyName,
				role,
				interviewStatus,
				packageOffered,
				challengesEncountered,
				overallFeedback,
				rounds: processedRounds,
			};

			try {
				let res;
				if (id) {
					// Update existing experience
					res = await axios.put(`/experience/${id}`, experienceData, {
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					});
				} else {
					// Create new experience
					res = await axios.post("/experience", experienceData, {
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					});
				}

				if (res.status === 200 || res.status === 201) {
					setFormSubmitted(true);
					// If editing, redirect to the experience page after a short delay
					if (id) {
						setTimeout(() => {
							navigate(`/experience/${id}`);
						}, 2000);
					}
				}
			} catch (err) {
				console.error(err);
				setError("Failed to submit experience. Please try again.");
			}
		} else {
			setError("Please fill in all required fields.");
		}
	};

	if (loading || loadingCompanies) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
					<p className="mt-2 text-gray-700">
						{loading
							? "Loading experience data..."
							: "Loading companies..."}
					</p>
				</div>
			</div>
		);
	}

	if (formSubmitted) {
		return (
			<div className="flex items-center justify-center h-screen px-4">
				<div className="max-w-md mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg text-center">
					<h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">
						{id
							? "Interview Experience Updated!"
							: "Interview Experience Submitted!"}
					</h2>
					<p className="text-gray-700 mb-4">
						{id
							? "Thank you for updating your interview experience."
							: "Thank you for sharing your interview experience."}
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<button
							onClick={() => setFormSubmitted(false)}
							className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
						>
							{id ? "Continue Editing" : "Add Another Experience"}
						</button>
						{id && (
							<button
								onClick={() => navigate(`/experience/${id}`)}
								className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
							>
								View Experience
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
			<form
				onSubmit={handleSubmit}
				className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg"
			>
				<h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
					{id
						? "Edit Interview Experience"
						: "Share Interview Experience"}
				</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
						{error}
					</div>
				)}

				{/* Name Section */}
				<div className="mb-6">
					<label className="block text-gray-700 mb-2 font-medium">
						Your Name *
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your full name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				{/* Company Selection Section */}
				<div className="mb-6">
					<label className="block text-gray-700 mb-2 font-medium">
						Company *
					</label>

					{/* Company Logo Display */}
					{companyName &&
						!isOtherCompany &&
						getSelectedCompanyLogo() && (
							<div className="mb-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
								<img
									src={getSelectedCompanyLogo()}
									alt={`${companyName} logo`}
									className="w-8 h-8 object-contain"
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
								<span className="font-medium text-gray-800">
									{companyName}
								</span>
							</div>
						)}

					<select
						value={isOtherCompany ? "other" : companyName}
						onChange={handleCompanyChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required={!isOtherCompany}
						disabled={loadingCompanies}
					>
						<option value="">
							{loadingCompanies
								? "Loading companies..."
								: "Select a company"}
						</option>
						{companies.map((company) => (
							<option
								key={company._id || company.name}
								value={company.name}
							>
								{company.name}
							</option>
						))}
						<option value="other">Other (Please specify)</option>
					</select>

					{/* Custom Company Input */}
					{isOtherCompany && (
						<input
							type="text"
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
							placeholder="Enter company name"
							className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					)}
				</div>

				{/* Role Section */}
				<div className="mb-6">
					<label className="block text-gray-700 mb-2 font-medium">
						Role *
					</label>
					<input
						type="text"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						placeholder="e.g., Software Engineer, Data Scientist"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				{/* Interview Status and Package */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div>
						<label className="block text-gray-700 mb-2 font-medium">
							Interview Status *
						</label>
						<div className="flex flex-wrap gap-2">
							{statusOptions.map((status) => (
								<button
									key={status.value}
									type="button"
									onClick={() =>
										setInterviewStatus(status.value)
									}
									className={`px-4 py-2 rounded-md transition-all duration-200 ease-in-out text-sm sm:text-base ${
										interviewStatus === status.value
											? `${status.activeBg} ${status.activeText}`
											: `${status.bgColor} ${status.textColor} hover:opacity-80`
									}`}
								>
									{status.label}
								</button>
							))}
						</div>
					</div>
					<div>
						<label className="block text-gray-700 mb-2 font-medium">
							Package Offered (LPA) *
						</label>
						<input
							type="number"
							value={packageOffered}
							onChange={(e) => setPackageOffered(e.target.value)}
							placeholder="Annual CTC in LPA"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Challenges Encountered Section */}
				<div className="mb-6">
					<label className="block text-gray-700 mb-2 font-medium">
						Challenges Encountered
					</label>
					<textarea
						value={challengesEncountered}
						onChange={(e) =>
							setChallengesEncountered(e.target.value)
						}
						placeholder="What were the difficulties you faced during the interview? (Optional)"
						className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
					/>
				</div>

				{/* Overall Feedback Textarea */}
				<div className="mb-6">
					<label className="block text-gray-700 mb-2 font-medium">
						Overall Feedback
					</label>
					<textarea
						value={overallFeedback}
						onChange={(e) => setOverallFeedback(e.target.value)}
						placeholder="Share your overall experience and tips"
						className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
					/>
				</div>

				{/* Interview Rounds */}
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Interview Rounds
					</h2>
					{rounds.map((round, roundIndex) => (
						<div
							key={roundIndex}
							className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
						>
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-grow">
									<span className="text-lg font-semibold text-gray-700 whitespace-nowrap">
										Round {round.number}
									</span>

									{/* Round Type Dropdown */}
									<select
										value={round.name}
										onChange={(e) =>
											updateRound(
												roundIndex,
												"name",
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									>
										<option value="">
											Select Round Type
										</option>
										{roundTypeOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</div>
								{rounds.length > 1 && (
									<button
										type="button"
										onClick={() => removeRound(roundIndex)}
										className="text-red-500 hover:text-red-700 transition-colors text-sm whitespace-nowrap"
									>
										Remove Round
									</button>
								)}
							</div>

							{/* Custom Round Name Input */}
							{round.isOtherRoundType && (
								<div className="mb-4">
									<input
										type="text"
										placeholder="Please specify the round type"
										value={round.customRoundName}
										onChange={(e) =>
											updateRound(
												roundIndex,
												"customRoundName",
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>
							)}

							{round.questions.map((question, questionIndex) => (
								<div
									key={questionIndex}
									className="bg-white border border-gray-100 rounded-md p-3 mb-3"
								>
									<div className="flex flex-col sm:flex-row mb-3 items-start sm:items-center gap-2">
										<span className="text-gray-600 font-medium whitespace-nowrap">
											Q{questionIndex + 1}
										</span>

										{/* Topic Dropdown */}
										<select
											value={question.topic}
											onChange={(e) =>
												updateQuestion(
													roundIndex,
													questionIndex,
													"topic",
													e.target.value
												)
											}
											className="flex-grow px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										>
											<option value="">
												Select Topic
											</option>
											{topicOptions.map((option) => (
												<option
													key={option}
													value={option}
												>
													{option}
												</option>
											))}
										</select>

										{round.questions.length > 1 && (
											<button
												type="button"
												onClick={() =>
													removeQuestion(
														roundIndex,
														questionIndex
													)
												}
												className="text-red-500 hover:text-red-700 transition-colors text-sm whitespace-nowrap"
											>
												Remove
											</button>
										)}
									</div>

									{/* Custom Topic Input */}
									{question.isOtherTopic && (
										<div className="mb-3">
											<input
												type="text"
												placeholder="Please specify the topic"
												value={question.customTopic}
												onChange={(e) =>
													updateQuestion(
														roundIndex,
														questionIndex,
														"customTopic",
														e.target.value
													)
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												required
											/>
										</div>
									)}

									<textarea
										placeholder="Question details or description"
										value={question.description}
										onChange={(e) =>
											updateQuestion(
												roundIndex,
												questionIndex,
												"description",
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-200 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
									/>

									{/* Coding Question Toggle and Difficulty Slider */}
									<div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<label className="flex items-center space-x-2 whitespace-nowrap">
											<input
												type="checkbox"
												checked={
													question.isCodingQuestion
												}
												onChange={(e) =>
													updateQuestion(
														roundIndex,
														questionIndex,
														"isCodingQuestion",
														e.target.checked
													)
												}
												className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
											/>
											<span className="text-sm sm:text-base">
												Coding Question
											</span>
										</label>

										{question.isCodingQuestion && (
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:flex-grow">
												<span className="text-sm text-gray-600 whitespace-nowrap">
													Difficulty:{" "}
													{getDifficultyLabel(
														question.codingDifficulty
													)}
												</span>
												<input
													type="range"
													min="1"
													max="5"
													value={
														question.codingDifficulty
													}
													onChange={(e) =>
														updateQuestion(
															roundIndex,
															questionIndex,
															"codingDifficulty",
															parseInt(
																e.target.value
															)
														)
													}
													className="flex-grow min-w-0"
												/>
											</div>
										)}
									</div>
								</div>
							))}

							<button
								type="button"
								onClick={() => addQuestion(roundIndex)}
								className="w-full py-2 mt-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
							>
								+ Add Question
							</button>
						</div>
					))}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4">
					<button
						type="button"
						onClick={addRound}
						className="w-full py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
					>
						+ Add Interview Round
					</button>
					<button
						type="submit"
						className="w-full py-3 bg-gray-600 text-white rounded-md hover:bg-black transition-colors font-medium"
					>
						{id ? "Update Experience" : "Submit Experience"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ExperienceForm;
