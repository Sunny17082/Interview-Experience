import React, { useState } from "react";

const comments = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState("");
    const [isCommentChanged, setIsCommentChanged] = useState(false);
    

    const handleAddComment = async (ev) => {
		ev.preventDefault();
		if (!userInfo?.id) {
			alert("Please login to post a comment");
			return navigate("/login");
		}
		if (newComment.trim() === "") {
			alert("Please enter a comment to post");
			return;
		}
		try {
			const response = await axios.post(
				`post/${postInfo._id}/comment`,
				JSON.stringify({ content: newComment }),
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = response.data;
			setComments(data.comments);
			setNewComment("");
			setIsCommentChanged(true);
		} catch (error) {
			console.error("Error adding comment:", error);
		}
    };
    
    const handleEditComment = (id, content) => {
		setEditingCommentId(id);
		setEditedCommentContent(content);
	};

	const handleUpdateComment = async (commentId) => {
		try {
			const response = await axios.put(
				`/post/${postInfo._id}/comment/${commentId}`,
				JSON.stringify({ content: editedCommentContent }),
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = response.data;
			setComments(data.comments);
			setEditingCommentId(null);
			setEditedCommentContent("");
			setIsCommentChanged(true);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeleteComment = async (commentId) => {
		try {
			const response = await axios.delete(
				`/post/${postInfo._id}/comment/${commentId}`
			);
			const data = response.data;
			setComments(data.comments);
			setIsCommentChanged(true);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="mt-6">
			<h3 className="text-2xl font-semibold mb-5 text-gray-900">
				Comments
			</h3>

			<form onSubmit={handleAddComment} className="mb-8">
				<textarea
					value={newComment}
					onChange={(ev) => setNewComment(ev.target.value)}
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-transparent"
					placeholder="Add a comment..."
					rows="3"
				></textarea>
				<button
					type="submit"
					className="mt-3 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300"
				>
					Post Comment
				</button>
			</form>
			<div className="mb-3 px-2">{comments.length} comments</div>
			{comments.map((comment, index) => (
				<div
					key={index}
					className="mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-200"
				>
					<div className="flex items-start gap-3">
						<Link to={`/profile/${comment.user._id}`}>
							<img
								src={comment.user.profileImg}
								alt={comment.user.name}
								className="w-10 h-10 basis-5 rounded-full object-cover border border-gray-300 flex-shrink-0"
							/>
						</Link>
						<div className="flex-grow basis-5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Link
										to={`/profile/${comment.user._id}`}
										className="font-semibold text-gray-900 text-sm"
									>
										{comment.user.name}
									</Link>
									{comment.user._id ===
										postInfo.author._id && (
										<span className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-semibold rounded-full">
											Author
										</span>
									)}
								</div>
								{userInfo.id === comment.user._id && (
									<div className="flex items-center gap-[5px]">
										<button
											onClick={() =>
												handleEditComment(
													comment._id,
													comment.content
												)
											}
											className="text-gray-600 hover:text-gray-800 transition duration-200"
											aria-label="Edit comment"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-5 h-5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
										</button>
										<button
											onClick={() =>
												handleDeleteComment(comment._id)
											}
											className="text-gray-600 hover:text-gray-800 transition duration-200"
											aria-label="Delete comment"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-5 h-5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
												/>
											</svg>
										</button>
									</div>
								)}
							</div>
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<Link to={`/profile/${comment.user._id}`}>
									@{comment.user.username}
								</Link>
								<span className="hidden sm:block">•</span>
								<span className="hidden sm:block">
									{comment.user?.followers?.length} followers
								</span>
							</div>
							<p className="text-[10px] text-gray-900">
								{formatISO9075(new Date(comment.createdAt))}
							</p>
							{editingCommentId !== comment._id && (
								<p className="text-gray-700 text-sm">
									{comment.content}
								</p>
							)}
						</div>
					</div>
					{editingCommentId === comment._id && (
						<div className="mt-3">
							<textarea
								value={editedCommentContent}
								onChange={(e) =>
									setEditedCommentContent(e.target.value)
								}
								className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent"
							/>
							<div className="flex gap-3 mt-2">
								<button
									onClick={() => setEditingCommentId(null)}
									className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
								>
									Cancel
								</button>
								<button
									onClick={() =>
										handleUpdateComment(comment._id)
									}
									className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-200"
								>
									Save
								</button>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default comments;
