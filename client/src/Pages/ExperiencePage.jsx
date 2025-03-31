import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ExperiencePage = () => {
	const { id } = useParams();
	const [experience, setExperience] = useState(null);
	const [expandedRounds, setExpandedRounds] = useState([]);
	const [isHelpful, setIsHelpful] = useState(false);
	const [summary, setSummary] = useState("");
	const [isLoadingSummary, setIsLoadingSummary] = useState(false);
	const [questionAnswers, setQuestionAnswers] = useState({});
	const [loadingAnswers, setLoadingAnswers] = useState({});

	useEffect(() => {
		getExperienceById();
	}, []);

	const getExperienceById = async () => {
		try {
			const response = await axios.get(`/experience/${id}`, {
				withCredentials: true,
			});
			if (response.status === 200) {
				console.log(response.data.experienceDoc);
				setExperience(response.data.experienceDoc);
				if (response.data.experienceDoc?.rounds?.length > 0) {
					setExpandedRounds(
						Array(response.data.experienceDoc.rounds.length).fill(
							true
						)
					);
				}
			}
		} catch (err) {
			console.error("Error fetching experience data:", err);
			toast.error("Failed to load interview experience");
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
						className={`h-2 w-4 ${
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

	const handleReport = () => {
		toast.success(
			"Report submitted successfully. Our team will review it."
		);
	};

	const handleHelpfulClick = () => {
		setIsHelpful(!isHelpful);
		// Here you could also implement an API call to track helpful votes
	};

	const toggleRoundExpanded = (roundIndex) => {
		const newExpandedState = [...expandedRounds];
		newExpandedState[roundIndex] = !newExpandedState[roundIndex];
		setExpandedRounds(newExpandedState);
	};

	// New function to generate summary
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

	// New function to get answer for a specific question
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
		<div className="max-w-5xl mx-auto px-4 py-8 bg-white min-h-screen">
			<div className="mb-8 flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						{experience?.name}
					</h1>
					<p className="text-gray-500 mt-1">
						Shared on {formatDate(experience?.createdAt)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={handleHelpfulClick}
						className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition ${
							isHelpful
								? "bg-green-100 text-green-800 border border-green-500"
								: "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
						}`}
					>
						<svg
							className="w-4 h-4"
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
						{isHelpful ? "Helpful!" : "Helpful"}
					</button>
					<button
						onClick={handleReport}
						className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
					>
						<svg
							className="w-4 h-4"
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
						Report
					</button>
				</div>
			</div>

			{/* Company and Role Info */}
			<div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<p className="text-gray-500 text-sm">Company</p>
						<p className="text-xl font-bold text-gray-900">
							{experience?.companyName}
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">Role</p>
						<p className="text-xl font-bold text-gray-900">
							{experience?.role}
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">Package Offered</p>
						<p className="text-xl font-bold text-gray-900">
							{experience?.packageOffered} LPA
						</p>
					</div>
					<div>
						<p className="text-gray-500 text-sm">
							Interview Status
						</p>
						<span
							className={`font-semibold text-sm capitalize px-2 py-1 rounded-full ${getStatusColor(
								experience?.interviewStatus
							)}`}
						>
							{experience?.interviewStatus}
						</span>
					</div>
				</div>
			</div>

			{/* AI Summary Section */}
			<div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-gray-900">
						AI-Generated Summary
					</h2>
					{!summary && (
						<button
							onClick={generateSummary}
							disabled={isLoadingSummary}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoadingSummary ? (
								<>
									<svg
										className="animate-spin h-4 w-4 text-white"
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
										className="w-4 h-4"
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
					<div className="prose max-w-none">
						<div className="whitespace-pre-wrap">{summary}</div>
					</div>
				) : (
					<div className="text-gray-500 italic">
						{isLoadingSummary
							? "Generating summary..."
							: "Click the button to generate an AI summary of this interview experience."}
					</div>
				)}
			</div>

			{/* Interview Rounds */}
			<h2 className="text-2xl font-bold text-gray-900 mb-4">
				Interview Rounds
			</h2>
			<div className="space-y-6">
				{experience?.rounds.map((round, roundIndex) => {
					const codingCount = countCodingQuestions(round.questions);
					const isExpanded = expandedRounds[roundIndex];
					return (
						<div
							key={roundIndex}
							className="border border-gray-200 rounded-lg overflow-hidden"
						>
							<div
								className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
								onClick={() => toggleRoundExpanded(roundIndex)}
							>
								<h3 className="text-lg font-semibold text-gray-800">
									Round {round.number}: {round.name}
								</h3>
								<div className="flex items-center gap-3">
									<span className="bg-gray-800 text-white text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
										<svg
											className="w-3 h-3 mr-1"
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
										{codingCount} Coding Questions
									</span>
									<svg
										className={`w-5 h-5 transform transition-transform ${
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
								<div className="p-6">
									<div className="space-y-6">
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
														<div className="p-4">
															<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
																<div className="mb-2 sm:mb-0">
																	<span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
																		{
																			question.topic
																		}
																	</span>
																	{question.isCodingQuestion && (
																		<span className="bg-gray-800 text-white text-xs font-medium ml-2 px-2.5 py-0.5 rounded">
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
															<pre className="text-gray-700 whitespace-pre-wrap break-words">
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
																	className="mt-4 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md border border-blue-300 hover:bg-blue-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
																>
																	{isLoading ? (
																		<>
																			<svg
																				className="animate-spin h-4 w-4 text-blue-600"
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
																				className="w-4 h-4"
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
															<div className="p-4 bg-blue-50 border-t border-blue-200">
																<div className="flex items-center mb-2">
																	<svg
																		className="w-5 h-5 text-blue-600 mr-2"
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
																	<h4 className="font-medium text-blue-800">
																		AI
																		Answer &
																		Explanation
																	</h4>
																</div>
																<div className="prose max-w-none text-gray-800">
																	<div className="whitespace-pre-wrap">
																		{
																			questionAnswers[
																				questionId
																			]
																		}
																	</div>
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
			<div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Challenges Encountered
				</h2>
				<p className="text-gray-700">
					{experience?.challengesEncountered}
				</p>
			</div>

			{/* Overall Feedback */}
			<div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Overall Feedback
				</h2>
				<p className="text-gray-700">{experience?.overallFeedback}</p>
			</div>
		</div>
	);
};

export default ExperiencePage;
