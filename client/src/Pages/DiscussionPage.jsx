import React, { useState, useEffect, useContext } from "react";
import {
	ArrowLeft,
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	Clock,
	User,
	Send,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const DiscussionPage = () => {
	const [discussion, setDiscussion] = useState(null);
	const [loading, setLoading] = useState(true);
	const [comment, setComment] = useState("");
	const [liked, setLiked] = useState(false);

	const { id } = useParams();

	const { user } = useContext(UserContext);

	useEffect(() => {
		getDiscussion();
	}, [liked, user]);

	const getDiscussion = async () => {
		try {
			const response = await axios.get(`/discussion/${id}`, {
				withCredentials: true,
			});
			if (response.status === 200) {
				setDiscussion(response.data.discussionDoc);
				setLiked(
					user && response.data.discussionDoc.likes.includes(user.id)
				);
				setLoading(false);
			} else {
				setLoading(false);
				toast.error("Failed to load discussion.");
			}
		} catch (err) {
			toast.error("Failed to load discussion.");
		}
	};

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please log in to add a comment.");
			return;
		}
		if (!comment.trim()) return;
		try {
			const response = await axios.post(
				`/discussion/${id}/comment`,
				{ comment },
				{
					withCredentials: true,
				}
			);
			if (response.status === 201) {
				toast.success("Comment added successfully.");
				setComment("");
				getDiscussion();
			}
		} catch (err) {
			toast.error("Failed to add comment.");
		}
	};

	const toggleLike = async () => {
		try {
			const response = await axios.post(`/discussion/${id}/like`, {
				withCredentials: true,
			});
			if (response.status === 200) {
				toast.success(response.data.message);
				setLiked(!liked);
			} else {
				toast.error("Failed to toggle like.");
			}
		} catch (err) {
			toast.error("Failed to toggle like.");
		}
	};

	const handleCommentReaction = (commentId, reactionType) => {
		// This would normally be an API call
		const updatedComments = discussion.comments.map((comment) => {
			if (comment._id === commentId) {
				if (reactionType === "like") {
					return { ...comment, likes: comment.likes + 1 };
				} else {
					return { ...comment, dislikes: comment.dislikes + 1 };
				}
			}
			return comment;
		});

		setDiscussion({
			...discussion,
			comments: updatedComments,
		});
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Avatar component for user logos - updated to black with first letter only
	const UserAvatar = ({ name }) => {
		const firstLetter = name?.charAt(0).toUpperCase();

		return (
			<div className="bg-black w-8 h-8 rounded-full flex items-center justify-center text-white font-medium">
				{firstLetter}
			</div>
		);
	}

	// Process markdown content to properly render all elements
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

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
					<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
					<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
					<div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
					<div className="h-64 bg-gray-200 rounded mb-6"></div>
				</div>
			</div>
		);
	}

	if (!discussion) {
		return (
			<div className="max-w-4xl mx-auto p-6 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Discussion not found
				</h2>
				<Link
					to="/discussions"
					className="inline-flex items-center text-gray-700 hover:text-black"
				>
					<ArrowLeft size={16} className="mr-2" />
					Back to discussions
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-6">
			{/* Navigation */}
			<Link
				to="/discussion"
				className="inline-flex items-center mb-6 text-gray-700 hover:text-black"
			>
				<ArrowLeft size={16} className="mr-2" />
				Back to discussions
			</Link>

			{/* Discussion header */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex items-center text-sm text-gray-600 mb-2">
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-800 mr-3">
						{discussion.type}
					</span>
					<span className="flex items-center mr-4">
						<User size={14} className="mr-1" />
						{discussion.user.name}
					</span>
					<span className="flex items-center">
						<Clock size={14} className="mr-1" />
						{formatDate(discussion.createdAt)}
					</span>
				</div>

				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					{discussion.title}
				</h1>

				<div
					className="prose prose-gray max-w-none"
					dangerouslySetInnerHTML={{
						__html: processMarkdown(discussion.content),
					}}
				/>

				<div className="flex items-center mt-6 pt-4 border-t border-gray-200">
					<button
						onClick={toggleLike}
						className={`flex items-center mr-4 ${
							liked ? "text-red" : "text-gray-500"
						} hover:text-black`}
					>
						<ThumbsUp
							size={18}
							className={`mr-1 ${liked ? "fill-current" : ""}`}
						/>
						{discussion.likes.length}
					</button>
					<div className="flex items-center text-gray-500">
						<MessageCircle size={18} className="mr-1" />
						{discussion.comments.length} comments
					</div>
				</div>
			</div>

			{/* Comments section */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-xl font-bold text-gray-900 mb-4">
					Comments ({discussion.comments.length})
				</h2>

				<div className="space-y-8">
					{discussion.comments.map((comment) => (
						<div
							key={comment._id}
							className="bg-gray-50 rounded-lg p-4 border border-gray-200"
						>
							<div className="flex items-center mb-3">
								{/* Fixed avatar positioning */}
								<Link to={`/profile/${comment?.user?._id}`} className="flex items-center">
									<UserAvatar name={comment?.user?.name} />
									<span className="font-medium text-gray-900 ml-2">
										{comment?.user?.name}
									</span>
								</Link>
								<span className="text-xs text-gray-500 ml-auto">
									{formatDate(comment.createdAt)}
								</span>
							</div>
							<div
								className="prose prose-sm prose-gray max-w-none mb-3"
								dangerouslySetInnerHTML={{
									__html: processMarkdown(comment.content),
								}}
							/>
							{/* <div className="flex items-center space-x-4 text-sm">
								<button
									onClick={() =>
										handleCommentReaction(
											comment._id,
											"like"
										)
									}
									className="flex items-center text-gray-600 hover:text-green-600"
								>
									<ThumbsUp size={14} className="mr-1" />
									<span>{comment.likes}</span>
								</button>
								<button
									onClick={() =>
										handleCommentReaction(
											comment._id,
											"dislike"
										)
									}
									className="flex items-center text-gray-600 hover:text-red-600"
								>
									<ThumbsDown size={14} className="mr-1" />
									<span>{comment.dislikes}</span>
								</button>
							</div> */}
						</div>
					))}
				</div>

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

			{/* No need for the separate style tag as we've included classes inline */}
		</div>
	);
};

export default DiscussionPage;
