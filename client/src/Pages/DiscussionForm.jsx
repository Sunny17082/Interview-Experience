import React, { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const DiscussionForm = () => {
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		type: "general",
	});

	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [previewMode, setPreviewMode] = useState(false);
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [linkInput, setLinkInput] = useState("");
	const [contentSelection, setContentSelection] = useState({
		start: 0,
		end: 0,
	});

	const {user} = useContext(UserContext);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Content is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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

		if (validateForm()) {
			try {
				const response = await axios.post("/discussion", formData, {
					withCredentials: true,
				});
				if (response.status === 201) {
					console.log(response.data);
					setIsSubmitted(true);
					toast.success("Discussion posted successfully!");
					setTimeout(() => {
						setFormData({
							title: "",
							content: "",
							type: "general",
						});
						setIsSubmitted(false);
					}, 2000);
				} else {
					toast.error("Failed to post discussion");
				}
			} catch (err) {
				console.error("Error posting discussion:", err);
				toast.error("Failed to post discussion");
				setErrors({ submit: "Failed to post discussion" });
			}
		}
	};

	const processMarkdown = (content) => {
		// Process headings (# Heading, ## Heading, ### Heading)
		let processedContent = content
			.replace(
				/^# (.*$)/gm,
				'<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>'
			)
			.replace(
				/^## (.*$)/gm,
				'<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>'
			)
			.replace(
				/^### (.*$)/gm,
				'<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>'
			);

		// Process formatting (bold, italic)
		processedContent = processedContent
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*([^*]+)\*/g, "<em>$1</em>");

		// Process bullet points properly (fix nesting issues)
		// First convert all bullet points to proper HTML list items
		processedContent = processedContent.replace(
			/^- (.*)$/gm,
			"<li>$1</li>"
		);

		// Then wrap all consecutive list items in a single ul element
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

		// Process code blocks with language support
		processedContent = processedContent.replace(
			/```(jsx|js|javascript)?\n([\s\S]*?)```/g,
			'<pre class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto my-4"><code>$2</code></pre>'
		);

		// Process inline code
		processedContent = processedContent.replace(
			/`([^`]+)`/g,
			'<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">$1</code>'
		);

		// Process tables with proper formatting
		const tableRegex = /\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n)+)/g;

		processedContent = processedContent.replace(
			tableRegex,
			(match, headerRow, bodyRows) => {
				// Process header
				const headers = headerRow
					.split("|")
					.filter((cell) => cell.trim() !== "");
				let tableHTML =
					'<table class="w-full border-collapse my-4">\n<thead>\n<tr>\n';

				headers.forEach((header) => {
					tableHTML += `<th class="border border-gray-300 px-4 py-2 bg-gray-50">${header.trim()}</th>\n`;
				});

				tableHTML += "</tr>\n</thead>\n<tbody>\n";

				// Process body rows
				const rows = bodyRows.trim().split("\n");
				rows.forEach((row) => {
					const cells = row
						.split("|")
						.filter((cell) => cell.trim() !== "");
					tableHTML += "<tr>\n";

					cells.forEach((cell) => {
						tableHTML += `<td class="border border-gray-300 px-4 py-2">${cell.trim()}</td>\n`;
					});

					tableHTML += "</tr>\n";
				});

				tableHTML += "</tbody>\n</table>";
				return tableHTML;
			}
		);

		return processedContent;
	};

	const handleTextFormat = (format) => {
		const textarea = document.getElementById("content");
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = formData.content.substring(start, end);

		setContentSelection({ start, end });

		if (format === "bold") {
			const newText =
				formData.content.substring(0, start) +
				`**${selectedText}**` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		} else if (format === "italic") {
			const newText =
				formData.content.substring(0, start) +
				`*${selectedText}*` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		} else if (format === "h1") {
			// Insert heading at beginning of line
			let lineStart = start;
			while (
				lineStart > 0 &&
				formData.content.charAt(lineStart - 1) !== "\n"
			) {
				lineStart--;
			}

			const newText =
				formData.content.substring(0, lineStart) +
				`# ${formData.content.substring(lineStart, end)}` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		} else if (format === "h2") {
			let lineStart = start;
			while (
				lineStart > 0 &&
				formData.content.charAt(lineStart - 1) !== "\n"
			) {
				lineStart--;
			}

			const newText =
				formData.content.substring(0, lineStart) +
				`## ${formData.content.substring(lineStart, end)}` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		} else if (format === "h3") {
			let lineStart = start;
			while (
				lineStart > 0 &&
				formData.content.charAt(lineStart - 1) !== "\n"
			) {
				lineStart--;
			}

			const newText =
				formData.content.substring(0, lineStart) +
				`### ${formData.content.substring(lineStart, end)}` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		} else if (format === "link") {
			setShowLinkInput(true);
		} else if (format === "table") {
			// Insert a sample table
			const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

			const newText =
				formData.content.substring(0, start) +
				tableTemplate +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
		}
	};

	const insertLink = () => {
		if (linkInput) {
			const { start, end } = contentSelection;
			const selectedText = formData.content.substring(start, end);
			const linkText = selectedText || "link text";

			const newText =
				formData.content.substring(0, start) +
				`[${linkText}](${linkInput})` +
				formData.content.substring(end);

			setFormData({ ...formData, content: newText });
			setShowLinkInput(false);
			setLinkInput("");
		}
	};

	useEffect(() => {
		if (showLinkInput) {
			document.getElementById("linkInput").focus();
		}
	}, [showLinkInput]);

	// Sample content to demonstrate markdown features
	const sampleMarkdown = `
# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2
- List item 3

\`\`\`
// This is a code block
function example() {
  return "Hello World";
}
\`\`\`

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

> This is a blockquote

  `;

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h2 className="text-3xl font-bold mb-6 text-black border-b-2 border-gray-200 pb-2">
				Create Discussion
			</h2>

			{isSubmitted && (
				<div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
					<svg
						className="w-5 h-5 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
					Discussion posted successfully!
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Title Field */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-semibold text-gray-800 mb-1"
					>
						Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
							errors.title
								? "border-red-500 focus:ring-red-200"
								: "border-gray-300 focus:ring-gray-200"
						}`}
						placeholder="Enter discussion title"
					/>
					{errors.title && (
						<p className="mt-1 text-sm text-red-600">
							{errors.title}
						</p>
					)}
				</div>

				{/* Discussion Type */}
				<div>
					<label
						htmlFor="type"
						className="block text-sm font-semibold text-gray-800 mb-1"
					>
						Discussion Type
					</label>
					<select
						id="type"
						name="type"
						value={formData.type}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 ${
							errors.type
								? "border-red-500 focus:ring-red-200"
								: "border-gray-300 focus:ring-gray-200"
						}`}
					>
						<option value="general">General Discussion</option>
						<option value="feedback">Feedback</option>
						<option value="question">Question</option>
						<option value="tips">Tips & Tricks</option>
						<option value="announcement">Announcement</option>
						<option value="other">Other</option>
					</select>
					{errors.type && (
						<p className="mt-1 text-sm text-red-600">
							{errors.type}
						</p>
					)}
				</div>

				{/* Content Field with Markdown Support */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label
							htmlFor="content"
							className="block text-sm font-semibold text-gray-800"
						>
							Content
						</label>
						<div className="flex text-sm">
							<button
								type="button"
								onClick={() => setPreviewMode(false)}
								className={`px-3 py-1 rounded-l ${
									!previewMode
										? "bg-gray-800 text-white"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								Write
							</button>
							<button
								type="button"
								onClick={() => setPreviewMode(true)}
								className={`px-3 py-1 rounded-r ${
									previewMode
										? "bg-gray-800 text-white"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								Preview
							</button>
						</div>
					</div>

					{!previewMode ? (
						<>
							{/* Text Formatting Toolbar */}
							<div className="flex flex-wrap bg-gray-50 p-2 rounded-t-md border border-gray-300 border-b-0">
								<button
									type="button"
									onClick={() => handleTextFormat("bold")}
									className="p-1 rounded mr-2 hover:bg-gray-200"
									title="Bold"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
										<path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
									</svg>
								</button>
								<button
									type="button"
									onClick={() => handleTextFormat("italic")}
									className="p-1 rounded mr-2 hover:bg-gray-200"
									title="Italic"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<line
											x1="19"
											y1="4"
											x2="10"
											y2="4"
										></line>
										<line
											x1="14"
											y1="20"
											x2="5"
											y2="20"
										></line>
										<line
											x1="15"
											y1="4"
											x2="9"
											y2="20"
										></line>
									</svg>
								</button>

								<div className="border-r border-gray-300 h-6 mx-2 my-auto"></div>

								<button
									type="button"
									onClick={() => handleTextFormat("h1")}
									className="px-2 py-1 rounded mr-1 hover:bg-gray-200 text-xs font-bold"
									title="Heading 1"
								>
									H1
								</button>
								<button
									type="button"
									onClick={() => handleTextFormat("h2")}
									className="px-2 py-1 rounded mr-1 hover:bg-gray-200 text-xs font-bold"
									title="Heading 2"
								>
									H2
								</button>
								<button
									type="button"
									onClick={() => handleTextFormat("h3")}
									className="px-2 py-1 rounded mr-2 hover:bg-gray-200 text-xs font-bold"
									title="Heading 3"
								>
									H3
								</button>

								<div className="border-r border-gray-300 h-6 mx-2 my-auto"></div>

								<button
									type="button"
									onClick={() => handleTextFormat("link")}
									className="p-1 rounded hover:bg-gray-200"
									title="Add Link"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
										<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
									</svg>
								</button>

								<button
									type="button"
									onClick={() => handleTextFormat("table")}
									className="p-1 rounded hover:bg-gray-200 ml-2"
									title="Add Table"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<rect
											x="3"
											y="3"
											width="18"
											height="18"
											rx="2"
											ry="2"
										></rect>
										<line
											x1="3"
											y1="9"
											x2="21"
											y2="9"
										></line>
										<line
											x1="3"
											y1="15"
											x2="21"
											y2="15"
										></line>
										<line
											x1="9"
											y1="3"
											x2="9"
											y2="21"
										></line>
										<line
											x1="15"
											y1="3"
											x2="15"
											y2="21"
										></line>
									</svg>
								</button>

								{/* Link Input Modal */}
								{showLinkInput && (
									<div className="flex ml-2 items-center bg-white px-2 py-1 rounded border border-gray-300">
										<input
											id="linkInput"
											type="text"
											value={linkInput}
											onChange={(e) =>
												setLinkInput(e.target.value)
											}
											placeholder="Enter URL"
											className="text-sm p-1 outline-none flex-grow"
										/>
										<button
											type="button"
											onClick={insertLink}
											className="ml-2 text-gray-800 px-2 py-1 text-sm hover:bg-gray-100 rounded"
										>
											Add
										</button>
										<button
											type="button"
											onClick={() =>
												setShowLinkInput(false)
											}
											className="ml-1 text-gray-500 px-1 hover:bg-gray-100 rounded"
										>
											<X size={14} />
										</button>
									</div>
								)}
							</div>

							<textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								rows="10"
								className={`w-full px-4 py-3 border border-gray-300 rounded-b-md resize-y focus:outline-none focus:ring-2 ${
									errors.content
										? "border-red-500 focus:ring-red-200"
										: "focus:ring-gray-200"
								}`}
								placeholder="What would you like to discuss? Markdown formatting is supported."
							></textarea>
						</>
					) : (
						<div className="border border-gray-300 rounded-md p-4 w-full min-h-64 bg-gray-50">
							{formData.content ? (
								<div
									className="prose prose-gray"
									dangerouslySetInnerHTML={{
										__html: processMarkdown(
											formData.content
										),
									}}
								/>
							) : (
								<div className="text-gray-400 mb-2">
									<p>Content preview will appear here...</p>
									<button
										type="button"
										onClick={() =>
											setFormData({
												...formData,
												content: sampleMarkdown.trim(),
											})
										}
										className="text-gray-700 text-xs underline mt-2 hover:text-gray-900"
									>
										Load sample markdown
									</button>
								</div>
							)}
						</div>
					)}

					{errors.content && (
						<p className="mt-1 text-sm text-red-600">
							{errors.content}
						</p>
					)}

					<div className="mt-1 text-xs text-gray-500">
						<p>
							Markdown supports: <strong>**bold**</strong>,{" "}
							<em>*italic*</em>, # H1, ## H2, ### H3, lists (-
							item), numbered lists (1. item), [links](url),
							`code`, ```code blocks```, blockquotes, and tables
						</p>
					</div>
				</div>

				{/* Submit Button */}
				<div>
					<button
						type="submit"
						className="w-full px-4 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
					>
						Post Discussion
					</button>
				</div>
			</form>
		</div>
	);
};

export default DiscussionForm;
