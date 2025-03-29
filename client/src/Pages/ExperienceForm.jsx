import React, { useState } from "react";
import axios from "axios";

const ExperienceForm = () => {
	const [interviewStatus, setInterviewStatus] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [role, setRole] = useState("");
	const [name, setName] = useState("");
	const [challengesEncountered, setChallengesEncountered] = useState("");
	const [overallFeedback, setOverallFeedback] = useState("");
	const [packageOffered, setPackageOffered] = useState(0);
	const [rounds, setRounds] = useState([
		{
			number: 1,
			name: "",
			questions: [
				{
					topic: "",
					description: "",
					isCodingQuestion: false,
					codingDifficulty: 5,
				},
			],
		},
	]);
	const [formSubmitted, setFormSubmitted] = useState(false);

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

	const addRound = () => {
		setRounds([
			...rounds,
			{
				number: rounds.length + 1,
				name: "",
				questions: [
					{
						topic: "",
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
		setRounds(newRounds);
	};

	const addQuestion = (roundIndex) => {
		const newRounds = [...rounds];
		newRounds[roundIndex].questions.push({
			topic: "",
			description: "",
			isCodingQuestion: false,
			codingDifficulty: 5,
		});
		setRounds(newRounds);
	};

	const updateQuestion = (roundIndex, questionIndex, field, value) => {
		const newRounds = [...rounds];
		newRounds[roundIndex].questions[questionIndex][field] = value;
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
		const isValid =
			companyName.trim() !== "" &&
			role.trim() !== "" &&
			interviewStatus !== "" &&
			rounds.every(
				(round) =>
					round.name.trim() !== "" &&
					round.questions.every((q) => q.topic.trim() !== "")
			);

		if (isValid) {
			try {
				const res = await axios.post(
					"/experience",
					{
						name,
						companyName,
						role,
						interviewStatus,
						packageOffered,
						challengesEncountered,
						overallFeedback,
						rounds,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				);
				if(res.status === 201) {
					setFormSubmitted(true);
				}
			} catch (err) {
				console.error(err);
			}
		} else {
			alert("Please fill in all required fields.");
		}
	};

	if (formSubmitted) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="max-w-md mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg text-center">
					<h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">
						Interview Experience Submitted!
					</h2>
					<p className="text-gray-700 mb-4">
						Thank you for sharing your interview experience.
					</p>
					<button
						onClick={() => setFormSubmitted(false)}
						className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
					>
						Add Another Experience
					</button>
				</div>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg"
		>
			<h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
				Interview Experience
			</h1>

			{/* Name Section */}
			<div className="mb-6">
				<label className="block text-gray-700 mb-2">Your Name *</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter your full name"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
					required
				/>
			</div>

			{/* Company and Role Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<div>
					<label className="block text-gray-700 mb-2">
						Company Name *
					</label>
					<input
						type="text"
						value={companyName}
						onChange={(e) => setCompanyName(e.target.value)}
						placeholder="e.g., Google, Amazon"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
						required
					/>
				</div>
				<div>
					<label className="block text-gray-700 mb-2">Role *</label>
					<input
						type="text"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						placeholder="e.g., Software Engineer, Data Scientist"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
						required
					/>
				</div>
			</div>

			{/* Interview Status, Feedback, and Package */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<div>
					<label className="block text-gray-700 mb-2">
						Interview Status *
					</label>
					<div className="flex flex-wrap gap-2">
						{statusOptions.map((status) => (
							<button
								key={status.value}
								type="button"
								onClick={() => setInterviewStatus(status.value)}
								className={`px-4 py-2 rounded-md transition-all duration-200 ease-in-out ${
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
					<label className="block text-gray-700 mb-2">
						Package Offered (only in LPA) *
					</label>
					<input
						type="number"
						value={packageOffered}
						onChange={(e) => setPackageOffered(e.target.value)}
						placeholder="Annual CTC in LPA"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
					/>
				</div>
			</div>

			{/* Challenges Encountered Section */}
			<div className="mb-6">
				<label className="block text-gray-700 mb-2">
					Challenges Encountered
				</label>
				<textarea
					value={challengesEncountered}
					onChange={(e) => setChallengesEncountered(e.target.value)}
					placeholder="What were the difficulties you faced during the interview? (Optional)"
					className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-200"
				/>
			</div>

			{/* Overall Feedback Textarea */}
			<div className="mb-6">
				<label className="block text-gray-700 mb-2">
					Overall Feedback
				</label>
				<textarea
					value={overallFeedback}
					onChange={(e) => setOverallFeedback(e.target.value)}
					placeholder="Share your overall experience and tips"
					className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-200"
				/>
			</div>

			{rounds.map((round, roundIndex) => (
				<div
					key={roundIndex}
					className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
				>
					<div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
						<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
							<span className="text-lg  font-semibold text-gray-700 sm:mr-4">
								Round{round.number}
							</span>
							<input
								type="text"
								placeholder="Round Name (e.g., Online Assessment)"
								value={round.name}
								onChange={(e) =>
									updateRound(
										roundIndex,
										"name",
										e.target.value
									)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
								required
							/>
						</div>
						{rounds.length > 1 && (
							<button
								type="button"
								onClick={() => removeRound(roundIndex)}
								className="text-red-500 hover:text-red-700 transition-colors mt-2 sm:mt-0"
							>
								Remove Round
							</button>
						)}
					</div>

					{round.questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className="bg-white border border-gray-100 rounded-md p-3 mb-3"
						>
							<div className="flex flex-col sm:flex-row mb-2 items-center space-y-2 sm:space-y-0">
								<span className="mr-3 text-gray-600 font-medium sm:mr-4">
									Q{questionIndex + 1}
								</span>
								<input
									type="text"
									placeholder="Topic (e.g., Data Structures)"
									value={question.topic}
									onChange={(e) =>
										updateQuestion(
											roundIndex,
											questionIndex,
											"topic",
											e.target.value
										)
									}
									className="w-full mr-4 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
									required
								/>
								{round.questions.length > 1 && (
									<button
										type="button"
										onClick={() =>
											removeQuestion(
												roundIndex,
												questionIndex
											)
										}
										className="text-red-500 hover:text-red-700 transition-colors mt-2 sm:mt-0"
									>
										Remove
									</button>
								)}
							</div>
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
								className="w-full px-3 py-2 border border-gray-200 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-200"
							/>

							{/* Coding Question Toggle and Difficulty Slider */}
							<div className="mt-3 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={question.isCodingQuestion}
										onChange={(e) =>
											updateQuestion(
												roundIndex,
												questionIndex,
												"isCodingQuestion",
												e.target.checked
											)
										}
										className="form-checkbox h-5 w-5 text-gray-600"
									/>
									<span>Coding Question</span>
								</label>

								{question.isCodingQuestion && (
									<div className="flex-grow flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
										<span className="text-sm text-gray-600 sm:mr-4">
											Difficulty:{" "}
											{getDifficultyLabel(
												question.codingDifficulty
											)}
										</span>
										<input
											type="range"
											min="1"
											max="5"
											value={question.codingDifficulty}
											onChange={(e) =>
												updateQuestion(
													roundIndex,
													questionIndex,
													"codingDifficulty",
													parseInt(e.target.value)
												)
											}
											className="flex-grow"
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

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button
					type="button"
					onClick={addRound}
					className="w-full py-3 mt-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
				>
					+ Add Interview Round
				</button>
				<button
					type="submit"
					className="w-full py-3 mt-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
				>
					Submit Experience
				</button>
			</div>
		</form>
	);
};

export default ExperienceForm;
