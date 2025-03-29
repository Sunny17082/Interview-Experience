import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ExperiencePage = () => {
	const { id } = useParams();
	const [experience, setExperience] = useState(null);
	const [expandedRounds, setExpandedRounds] = useState([]); // Track expanded state for all rounds
	const [isHelpful, setIsHelpful] = useState(false); // Track helpful button state

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
				// Set all rounds as expanded by default if rounds exist
				if (response.data.experienceDoc?.rounds?.length > 0) {
					// Create an array of true values with the same length as rounds array
					setExpandedRounds(
						Array(response.data.experienceDoc.rounds.length).fill(
							true
						)
					);
				}
			}
		} catch (err) {
			console.error("Error fetching experience data:", err);
		}
	};

	// Helper function to get status color
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

	// Helper function to get status text color
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

	// Helper function to count coding questions in a round
	const countCodingQuestions = (questions) => {
		return questions.filter((q) => q.isCodingQuestion).length;
	};

	// Helper function to get difficulty bar
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

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Handle reporting
	const handleReport = () => {
		// Implementation for report functionality would go here
		toast.success("report submitted successfully. our team will review it.");
	};

	// Handle helpful button click
	const handleHelpfulClick = () => {
		setIsHelpful(!isHelpful);
		// Here you could also implement an API call to track helpful votes
	};

	// Toggle expanded state for a specific round
	const toggleRoundExpanded = (roundIndex) => {
		const newExpandedState = [...expandedRounds];
		newExpandedState[roundIndex] = !newExpandedState[roundIndex];
		setExpandedRounds(newExpandedState);
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
									<div className="space-y-4">
										{round.questions.map(
											(question, questionIndex) => (
												<div
													key={questionIndex}
													className="p-4 bg-gray-50 rounded-md"
												>
													<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
														<div className="mb-2 sm:mb-0">
															<span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
																{question.topic}
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
														{question.description}
													</pre>
												</div>
											)
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
