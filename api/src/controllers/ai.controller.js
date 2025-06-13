const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const handleGetSummary = async (req, res) => {
	try {
		const { experienceData } = req.body;

		if (!experienceData) {
			return res.status(400).json({
				success: false,
				message: "Experience data is required",
			});
		}

		// Create a prompt for the AI to generate a summary
		const roundsInfo = experienceData.rounds
			.map((round) => {
				const questionsDetails = round.questions
					.map(
						(question) =>
							`${question.topic}: ${question.description}`
					)
					.join(", ");

				return `Round ${round.number}: ${round.name} - ${round.questions.length} questions (${questionsDetails})`;
			})
			.join("\n");


		// Then in your prompt template:
		const prompt = `Generate a detailed summary of this interview experience:
  
        Candidate Name: ${experienceData.name}
        Company: ${experienceData.companyName}
        Role: ${experienceData.role}
        Interview Status: ${experienceData.interviewStatus}
        Package Offered: ${experienceData.packageOffered} LPA
  
        Interview Rounds (${experienceData.rounds.length}):
        ${roundsInfo}
  
        Challenges Encountered: ${experienceData.challengesEncountered}
        Overall Feedback: ${experienceData.overallFeedback}
  
        Please provide a summary that highlights:
		- Key takeaways from each round
		- Important questions asked
		- Any challenges faced during the interview process
        `;

		// Generate the summary using Gemini
		const result = await model.generateContent(prompt);
		const summary = result.response.text();

		return res.status(200).json({
			success: true,
			summary,
		});
	} catch (error) {
		console.error("Error generating summary:", error.message);
		return res.status(500).json({
			success: false,
			message: "Failed to generate summary",
			error: error.message,
		});
	}
};

const handleGetAnswer = async (req, res) => {
	try {
		const { questionData, topic } = req.body;

		if (!questionData || !topic) {
			return res.status(400).json({
				success: false,
				message: "Question data and topic are required",
			});
		}

		// Create a prompt based on the question and topic
		let prompt = ``;

		if (questionData.isCodingQuestion) {
			prompt = `
        Provide a small explanation and solution for this coding interview question it must have exact answer that is asked:
        
        Topic: ${topic}
        Question: ${questionData.description}
        Difficulty Level: ${questionData.codingDifficulty}/5
        
        Please include:
        A clear explanation of the problem give code in pseudo code format don't give code in any programming language, key points that would impress an interviewe, real-world applications or examples if relevant, any related concepts that might be worth mentioning
        also include the time complexity and space complexity of the solution.
      `;
		} else {
			prompt = `
        Provide a small explanation and solution for this interview question it must have exact answer that is asked
		search wikipedia and give correct answer if any data is required to answer this question:
        
        Topic: ${topic}
        Question: ${questionData.description}
        
        Please include:
        A clear explanation of the concept, key points that would impress an interviewe, real-world applications or examples if relevant, any related concepts that might be worth mentioning
      `;
		}

		// Generate the answer using Gemini
		const result = await model.generateContent(prompt);
		const answer = result.response.text();

		return res.status(200).json({
			success: true,
			answer,
		});
	} catch (error) {
		console.error("Error generating answer:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to generate answer",
			error: error.message,
		});
	}
};

module.exports = {
	handleGetSummary,
	handleGetAnswer,
};
