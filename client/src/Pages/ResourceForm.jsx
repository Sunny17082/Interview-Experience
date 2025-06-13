import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const ResourceForm = () => {
	const [formData, setFormData] = useState({
		title: "",
		banner: "",
		description: "",
		url: "",
		type: "",
		tags: "",
	});

	const { user } = useContext(UserContext);

	const [errors, setErrors] = useState({});

	const resourceTypes = ["video", "article", "course"];

	const availableTags = [
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
		"others",
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.title) newErrors.title = "Title is required";
		if (!formData.description)
			newErrors.description = "Description is required";
		if (!formData.url) newErrors.url = "URL is required";
		if (!formData.type) newErrors.type = "Type is required";
		if (!formData.tags) newErrors.tags = "At least one tag is required";

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
		if (validate()) {
			try {
				const response = await axios.post(
					"/resource",
					{
						title: formData.title,
						banner: formData.banner,
						description: formData.description,
						url: formData.url,
						type: formData.type,
						tags: formData.tags,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				);
				if (response.status === 201) {
					toast.success("Resource added successfully!");
					setFormData({
						title: "",
						banner: "",
						description: "",
						url: "",
						type: "",
						tags: "",
					});
				}
			} catch (err) {
				console.error("Error submitting form:", err);
				toast.error("Error submitting form. Please try again.");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Add New Resource
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Title Field */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							placeholder="Enter resource title"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-500">
								{errors.title}
							</p>
						)}
					</div>

					{/* Banner URL Field */}
					<div>
						<label
							htmlFor="banner"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Banner Image URL
						</label>
						<input
							type="text"
							id="banner"
							name="banner"
							value={formData.banner}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							placeholder="Enter banner image URL (optional)"
						/>
					</div>

					{/* Description Field */}
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description <span className="text-red-500">*</span>
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows="4"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							placeholder="Enter resource description"
						></textarea>
						{errors.description && (
							<p className="mt-1 text-sm text-red-500">
								{errors.description}
							</p>
						)}
					</div>

					{/* URL Field */}
					<div>
						<label
							htmlFor="url"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Resource URL <span className="text-red-500">*</span>
						</label>
						<input
							type="url"
							id="url"
							name="url"
							value={formData.url}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
							placeholder="https://example.com/resource"
						/>
						{errors.url && (
							<p className="mt-1 text-sm text-red-500">
								{errors.url}
							</p>
						)}
					</div>

					{/* Resource Type Field */}
					<div>
						<label
							htmlFor="type"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Resource Type{" "}
							<span className="text-red-500">*</span>
						</label>
						<select
							id="type"
							name="type"
							value={formData.type}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
						>
							<option value="">Select a type</option>
							{resourceTypes.map((type) => (
								<option key={type} value={type}>
									{type.charAt(0).toUpperCase() +
										type.slice(1)}
								</option>
							))}
						</select>
						{errors.type && (
							<p className="mt-1 text-sm text-red-500">
								{errors.type}
							</p>
						)}
					</div>

					{/* Tags Field */}
					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Tags <span className="text-red-500">*</span>
						</label>
						<select
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
						>
							<option value="">Select a tag</option>
							{availableTags.map((tag) => (
								<option key={tag} value={tag}>
									{tag}
								</option>
							))}
						</select>
						{errors.tags && (
							<p className="mt-1 text-sm text-red-500">
								{errors.tags}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<div className="pt-4">
						<button
							type="submit"
							className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
						>
							Submit Resource
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ResourceForm;
