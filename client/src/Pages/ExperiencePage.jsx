import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../UserContext";
import { MessageCircle, Send, User, Clock, Edit, Trash } from "lucide-react";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import { Link } from "react-router-dom";
import ReportModal from "../Components/ReportModal";

const ExperiencePage = () => {
	const { id } = useParams();
	const [experience, setExperience] = useState(null);
	const [expandedRounds, setExpandedRounds] = useState([]);
	const [isHelpful, setIsHelpful] = useState(false);
	const [summary, setSummary] = useState("");
	const [isLoadingSummary, setIsLoadingSummary] = useState(false);
	const [questionAnswers, setQuestionAnswers] = useState({});
	const [loadingAnswers, setLoadingAnswers] = useState({});
	const [helpfulCount, setHelpfulCount] = useState(0);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// New state for comments
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const [loadingComments, setLoadingComments] = useState(true);
	const [showReportModal, setShowReportModal] = useState(false);
	const [isReportingLoading, setIsReportingLoading] = useState(false);

	const navigate = useNavigate();

	const { user } = useContext(UserContext);

	useEffect(() => {
		getExperienceById();
	}, [isHelpful, user]);

	const getExperienceById = async () => {
		try {
			const response = await axios.get(`/experience/${id}`, {
				withCredentials: true,
			});
			if (response.status === 200) {
				console.log(response.data.experienceDoc);
				setExperience(response.data.experienceDoc);
				setHelpfulCount(response.data.experienceDoc.helpful.length);
				setIsHelpful(
					user &&
						response.data.experienceDoc.helpful.includes(user.id)
				);
				setLoadingComments(false);
				if (response.data.experienceDoc?.rounds?.length > 0) {
					setExpandedRounds(
						Array(response.data.experienceDoc.rounds.length).fill(
							false
						)
					);
				}
			}
		} catch (err) {
			console.error("Error fetching experience data:", err);
			toast.error("Failed to load interview experience");
		}
	};

	// New function to submit a comment
	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please log in to add a comment.");
			return;
		}
		if (!comment.trim()) return;
		try {
			const response = await axios.post(
				`/experience/${id}/comment`,
				{ comment },
				{ withCredentials: true }
			);
			if (response.status === 201) {
				toast.success("Comment added successfully.");
				setComment("");
				getExperienceById();
			}
		} catch (err) {
			console.error("Error adding comment:", err);
			toast.error("Failed to add comment");
		}
	};

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case "offered":
				return "bg-green-500 text-white";
			case "rejected":
				return "bg-red-500 text-white";
			case "in process":
				return "bg-yellow-500 text-black";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const getStatusTextColor = (status) => {
		switch (status?.toLowerCase()) {
			case "offered":
				return "text-green-500";
			case "rejected":
				return "text-red-500";
			case "in process":
				return "text-yellow-500";
			default:
				return "text-gray-500";
		}
	};

	const countCodingQuestions = (questions) => {
		return questions.filter((q) => q.isCodingQuestion).length;
	};

	const DifficultyBar = ({ level }) => {
		return (
			<div className="flex items-center space-x-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<div
						key={star}
						className={`h-2 w-3 sm:w-4 ${
							star <= level ? "bg-gray-800" : "bg-gray-300"
						}`}
					/>
				))}
			</div>
		);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// More detailed date formatting for comments
	const formatCommentDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const handleDeleteExperience = async () => {
		const response = await axios.delete(`/experience/${id}`, {
			withCredentials: true,
		});
		if (response.status === 200) {
			toast.success("Experience deleted successfully.");
			navigate("/experience");
		}
	};

	const handleReport = async (reportData) => {
		setIsReportingLoading(true);
		try {
			const response = await axios.post(
				`/experience/${id}/report`,
				{
					reason: reportData.reason,
					details: reportData.details,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				setShowReportModal(false);
			} else {
				toast.error(response.data.message);
			}
		} catch (err) {
			console.error("Error reporting experience:", err);
			toast.error(
				err.response?.data?.message || "Failed to report experience"
			);
		} finally {
			setIsReportingLoading(false);
		}
	};

	const handleHelpfulClick = async () => {
		try {
			if (!user) {
				toast.error("Please log in to mark as helpful.");
				return;
			}
			const response = await axios.put(`/experience/${id}/helpful`, {
				withCredentials: true,
			});

			if (response.status === 200) {
				setIsHelpful(response.data.isHelpful);
				toast.success(response.data.message);
			}
		} catch (err) {
			console.error("Error updating helpful status:", err);
			toast.error("Failed to update helpful status");
		}
	};

	const toggleRoundExpanded = (roundIndex) => {
		const newExpandedState = [...expandedRounds];
		newExpandedState[roundIndex] = !newExpandedState[roundIndex];
		setExpandedRounds(newExpandedState);
	};

	// New Avatar component for comments
	const UserAvatar = ({ name }) => {
		const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

		return (
			<div className="bg-black w-8 h-8 rounded-full flex items-center justify-center text-white font-medium">
				{firstLetter}
			</div>
		);
	};

	// Process markdown content for comments
	const processMarkdown = (content) => {
		// Process headings
		let processedContent = content
			.replace(
				/^# (.*$)/gm,
				'<h1 class="text-2xl sm:text-3xl font-bold mt-6 mb-4">$1</h1>'
			)
			.replace(
				/^## (.*$)/gm,
				'<h2 class="text-xl sm:text-2xl font-bold mt-5 mb-3">$1</h2>'
			)
			.replace(
				/^### (.*$)/gm,
				'<h3 class="text-lg sm:text-xl font-bold mt-4 mb-2">$1</h3>'
			);

		// Process formatting (bold, italic)
		processedContent = processedContent
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*([^*]+)\*/g, "<em>$1</em>");

		// Process bullet points
		processedContent = processedContent.replace(
			/^- (.*)$/gm,
			"<li>$1</li>"
		);

		processedContent = processedContent.replace(
			/(<li>.*<\/li>(\n|$))+/g,
			(match) => {
				return `<ul class="list-disc pl-5 my-3">${match}</ul>`;
			}
		);

		// Process blockquotes
		processedContent = processedContent.replace(
			/^> (.*)$/gm,
			'<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-3">$1</blockquote>'
		);

		// Process code blocks
		processedContent = processedContent.replace(
			/```(jsx|js|javascript)?\n([\s\S]*?)```/g,
			'<pre class="bg-gray-800 text-gray-200 p-3 sm:p-4 rounded-md overflow-x-auto my-4 text-sm"><code>$2</code></pre>'
		);

		// Process inline code
		processedContent = processedContent.replace(
			/`([^`]+)`/g,
			'<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">$1</code>'
		);

		return processedContent;
	};

	// Function to generate summary
	const generateSummary = async () => {
		if (!experience) return;

		setIsLoadingSummary(true);
		try {
			const response = await axios.post(
				"/ai/summary",
				{
					experienceData: experience,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setSummary(response.data.summary);
			}
		} catch (err) {
			console.error("Error generating summary:", err);
			toast.error("Failed to generate summary");
		} finally {
			setIsLoadingSummary(false);
		}
	};

	// Function to get answer for a specific question
	const getQuestionAnswer = async (roundIndex, questionIndex) => {
		if (!experience) return;

		const round = experience.rounds[roundIndex];
		const question = round.questions[questionIndex];
		const questionId = `${roundIndex}-${questionIndex}`;

		// Set loading state for this specific question
		setLoadingAnswers((prev) => ({
			...prev,
			[questionId]: true,
		}));

		try {
			const response = await axios.post(
				"/ai/answer",
				{
					questionData: question,
					topic: question.topic,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setQuestionAnswers((prev) => ({
					...prev,
					[questionId]: response.data.answer,
				}));
			}
		} catch (err) {
			console.error("Error getting question answer:", err);
			toast.error("Failed to generate answer");
		} finally {
			setLoadingAnswers((prev) => ({
				...prev,
				[questionId]: false,
			}));
		}
	};

	return (
		<div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 bg-white min-h-screen">
			<div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
				<div className="flex-1">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
						{experience?.name}
					</h1>
					<p className="text-gray-500 mt-1 text-sm sm:text-base">
						Shared on {formatDate(experience?.createdAt)}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{user && user.email !== experience?.user?.email && (
						<button
							onClick={handleHelpfulClick}
							className={`px-3 py-1.5 sm:py-1 rounded-md flex items-center gap-2 transition text-sm ${
								isHelpful
									? "bg-green-100 text-green-800 border border-green-500"
									: "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
							}`}
						>
							<svg
								className="w-4 h-4 flex-shrink-0"
								fill={isHelpful ? "currentColor" : "none"}
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
								></path>
							</svg>
							<span className="whitespace-nowrap">
								{helpfulCount + " "}
								{isHelpful ? "Helpful!" : "Helpful"}
							</span>
						</button>
					)}
					{user && user.email !== experience?.user?.email && (
						<button
							onClick={() => setShowReportModal(true)}
							className="px-3 py-1.5 sm:py-1 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 flex items-center gap-2 text-sm"
						>
							<svg
								className="w-4 h-4 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								></path>
							</svg>
							<span className="hidden sm:inline">Report</span>
						</button>
					)}
					{user && user.email === experience?.user?.email && (
						<Link
							to={`/experience/edit/${experience._id}`}
							className="px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
						>
							<Edit size={16} />
						</Link>
					)}
					{user && user.email === experience?.user?.email && (
						<button
							onClick={() => setShowDeleteModal(true)}
							className="px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
						>
							<Trash size={16} />
						</button>
					)}
				</div>
			</div>

			{/* Company and Role Info */}
			<div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					<div>
						<p className="text-gray-500 text-sm">Company</p>
						<p className="text-lg sm:text-xl font-bold text-gray-900 break-words">
							{experience?.companyName}
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">Role</p>
						<p className="text-lg sm:text-xl font-bold text-gray-900 break-words">
							{experience?.role}
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">Package Offered</p>
						<p className="text-lg sm:text-xl font-bold text-gray-900">
							{experience?.packageOffered} LPA
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">
							Interview Status
						</p>
						<span
							className={`font-semibold text-sm capitalize px-2 py-1 rounded-full inline-block mt-1 ${getStatusColor(
								experience?.interviewStatus
							)}`}
						>
							{experience?.interviewStatus}
						</span>
					</div>
				</div>
			</div>

			{/* AI Summary Section */}
			<div className="mb-6 sm:mb-8 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
						AI-Generated Summary
					</h2>
					{!summary && (
						<button
							onClick={generateSummary}
							disabled={isLoadingSummary}
							className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
						>
							{isLoadingSummary ? (
								<>
									<svg
										className="animate-spin h-4 w-4 text-white flex-shrink-0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span>Generating...</span>
								</>
							) : (
								<>
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path>
									</svg>
									<span>Generate Summary</span>
								</>
							)}
						</button>
					)}
				</div>
				{summary ? (
					<div className="prose prose-sm sm:prose max-w-none">
						<ReactMarkdown>{summary}</ReactMarkdown>
					</div>
				) : (
					<div className="text-gray-500 italic text-sm sm:text-base">
						{isLoadingSummary
							? "Generating summary..."
							: "Click the button to generate an AI summary of this interview experience."}
					</div>
				)}
			</div>

			{/* Interview Rounds */}
			<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
				Interview Rounds
			</h2>
			<div className="space-y-4 sm:space-y-6">
				{experience?.rounds.map((round, roundIndex) => {
					const codingCount = countCodingQuestions(round.questions);
					const isExpanded = expandedRounds[roundIndex];
					return (
						<div
							key={roundIndex}
							className="border border-gray-200 rounded-lg overflow-hidden"
						>
							<div
								className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
								onClick={() => toggleRoundExpanded(roundIndex)}
							>
								<h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2">
									Round {round.number}: {round.name}
								</h3>
								<div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
									<span className="bg-gray-800 text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded flex items-center">
										<svg
											className="w-3 h-3 mr-1 flex-shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
											></path>
										</svg>
										<span className="hidden sm:inline">
											{codingCount} Coding Questions
										</span>
										<span className="sm:hidden">
											{codingCount}
										</span>
									</span>
									<svg
										className={`w-5 h-5 transform transition-transform flex-shrink-0 ${
											isExpanded ? "rotate-180" : ""
										}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										></path>
									</svg>
								</div>
							</div>
							{isExpanded && (
								<div className="p-4 sm:p-6">
									<div className="space-y-4 sm:space-y-6">
										{round.questions.map(
											(question, questionIndex) => {
												const questionId = `${roundIndex}-${questionIndex}`;
												const hasAnswer =
													questionAnswers[questionId];
												const isLoading =
													loadingAnswers[questionId];

												return (
													<div
														key={questionIndex}
														className="bg-gray-50 rounded-md overflow-hidden"
													>
														<div className="p-3 sm:p-4">
															<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
																<div className="flex flex-wrap gap-2">
																	<span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
																		{
																			question.topic
																		}
																	</span>
																	{question.isCodingQuestion && (
																		<span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded">
																			Coding
																		</span>
																	)}
																</div>
																{question.isCodingQuestion && (
																	<div className="flex items-center">
																		<span className="text-xs text-gray-500 mr-2">
																			Difficulty:
																		</span>
																		<DifficultyBar
																			level={
																				question.codingDifficulty
																			}
																		/>
																	</div>
																)}
															</div>
															<pre className="text-gray-700 whitespace-pre-wrap break-words text-sm sm:text-base">
																{
																	question.description
																}
															</pre>

															{!hasAnswer ? (
																<button
																	onClick={() =>
																		getQuestionAnswer(
																			roundIndex,
																			questionIndex
																		)
																	}
																	disabled={
																		isLoading
																	}
																	className="mt-3 sm:mt-4 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-300 flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
																>
																	{isLoading ? (
																		<>
																			<svg
																				className="animate-spin h-4 w-4 text-gray-600 flex-shrink-0"
																				xmlns="http://www.w3.org/2000/svg"
																				fill="none"
																				viewBox="0 0 24 24"
																			>
																				<circle
																					className="opacity-25"
																					cx="12"
																					cy="12"
																					r="10"
																					stroke="currentColor"
																					strokeWidth="4"
																				></circle>
																				<path
																					className="opacity-75"
																					fill="currentColor"
																					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																				></path>
																			</svg>
																			<span>
																				Generating
																				Answer...
																			</span>
																		</>
																	) : (
																		<>
																			<svg
																				className="w-4 h-4 flex-shrink-0"
																				fill="none"
																				stroke="currentColor"
																				viewBox="0 0 24 24"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth="2"
																					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																				></path>
																			</svg>
																			<span>
																				Get
																				AI
																				Explanation
																			</span>
																		</>
																	)}
																</button>
															) : null}
														</div>

														{/* AI-generated answer section */}
														{hasAnswer && (
															<div className="p-3 sm:p-4 bg-gray-300 border-t border-gray-200">
																<div className="flex items-center mb-2">
																	<svg
																		className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth="2"
																			d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
																		></path>
																	</svg>
																	<h4 className="font-medium text-gray-800 text-sm sm:text-base">
																		AI
																		Answer &
																		Explanation
																	</h4>
																</div>
																<div className="prose prose-sm sm:prose max-w-none">
																	<ReactMarkdown>
																		{
																			questionAnswers[
																				questionId
																			]
																		}
																	</ReactMarkdown>
																</div>
															</div>
														)}
													</div>
												);
											}
										)}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Challenges Encountered */}
			{experience?.challengesEncountered !== "" && (
				<div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						Challenges
					</h2>
					<p className="text-gray-700">
						{experience?.challengesEncountered}
					</p>
				</div>
			)}

			{/* Overall Feedback */}
			{experience?.overallFeedback && <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-xl font-bold text-gray-900">
						Overall Feedback
					</h2>
					{experience?.feedbackSentiment?.category && (
						<span
							className={`px-3 py-1 text-sm font-medium rounded-full ${experience.feedbackSentiment.category ===
									"positive"
									? "bg-green-100 text-green-800"
									: experience.feedbackSentiment.category ===
										"negative"
										? "bg-red-100 text-red-800"
										: "bg-gray-100 text-gray-800"
								}`}
						>
							{experience.feedbackSentiment.category
								.charAt(0)
								.toUpperCase() +
								experience.feedbackSentiment.category.slice(1)}
						</span>
					)}
				</div>
				<p className="text-gray-700">{experience?.overallFeedback}</p>
			</div>}

			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteExperience}
				itemName="interview experience"
			/>

			{/* New Comments Section */}
			<div className="mt-8 bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center mb-4">
					<h2 className="text-xl font-bold text-gray-900">
						Comments
					</h2>
					<div className="ml-2 flex items-center text-gray-500">
						<MessageCircle size={18} className="mr-1" />
						{experience?.comments?.length}
					</div>
				</div>

				{loadingComments ? (
					<div className="animate-pulse">
						<div className="h-16 bg-gray-200 rounded mb-4"></div>
						<div className="h-16 bg-gray-200 rounded mb-4"></div>
					</div>
				) : (
					<div className="space-y-8">
						{experience?.comments?.length === 0 ? (
							<p className="text-gray-500 italic">
								No comments yet. Be the first to share your
								thoughts!
							</p>
						) : (
							experience?.comments.map((comment) => (
								<div
									key={comment?._id}
									className="bg-gray-50 rounded-lg p-4 border border-gray-200"
								>
									<div className="flex items-center mb-3">
										<Link to={`/profile/${comment?.user?._id}`} className="flex items-center">
											<UserAvatar
												name={comment?.user?.name}
											/>
											<span className="font-medium text-gray-900 ml-2">
												{comment?.user?.name}
											</span>
										</Link>
										<span className="text-xs text-gray-500 ml-auto flex items-center">
											<Clock size={12} className="mr-1" />
											{formatCommentDate(
												comment?.createdAt
											)}
										</span>
									</div>
									<div
										className="prose prose-sm prose-gray max-w-none mb-3"
										dangerouslySetInnerHTML={{
											__html: processMarkdown(
												comment?.content
											),
										}}
									/>
								</div>
							))
						)}
					</div>
				)}

				{/* Add comment form */}
				<form
					onSubmit={handleSubmitComment}
					className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200"
				>
					<label
						htmlFor="comment"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Add your comment
					</label>
					<textarea
						id="comment"
						rows={4}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
						placeholder="Write your comment... Markdown formatting is supported."
					></textarea>
					<div className="text-xs text-gray-500 mt-1 mb-3">
						Markdown supports: **bold**, *italic*, ```code
						blocks```, quotes, and more
					</div>
					<button
						type="submit"
						className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
					>
						<Send size={16} className="mr-2" />
						Post Comment
					</button>
				</form>
			</div>
			<ReportModal
				isOpen={showReportModal}
				onClose={() => setShowReportModal(false)}
				onSubmit={handleReport}
				isLoading={isReportingLoading}
			/>
		</div>
	);
};

export default ExperiencePage;
