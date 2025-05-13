import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const JobsForm = () => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		company: "",
		url: "",
		type: "",
		applicationDeadline: "",
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const { user } = useContext(UserContext);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.title.trim()) newErrors.title = "Job title is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		if (!formData.company.trim())
			newErrors.company = "Company name is required";
		if (!formData.url.trim()) newErrors.url = "URL is required";
		if (!formData.type) newErrors.type = "Job type is required";
		if (!formData.applicationDeadline)
			newErrors.applicationDeadline = "Application deadline is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
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
			setIsSubmitting(true);
			try {
				const response = await axios.post("/jobs", {
					title: formData.title,
					description: formData.description,
					company: formData.company,
					url: formData.url,
					type: formData.type,
					applicationDeadline: formData.applicationDeadline,
				});
				if (response.status === 201) {
					setIsSubmitting(false);
					setSubmitSuccess(true);
					setFormData({
						title: "",
						description: "",
						company: "",
						url: "",
						type: "",
						applicationDeadline: "",
					});
				}
			} catch (err) {
				setIsSubmitting(false);
				setSubmitSuccess(false);
				if (err.response) {
					setErrors({ apiError: err.response.data.message });
				} else {
					setErrors({ apiError: "An error occurred" });
				}
			}
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Post a New Job
			</h2>

			{submitSuccess && (
				<div className="mb-4 p-3 bg-gray-800 text-white rounded-md">
					Job listing created successfully!
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Job Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className={`w-full px-3 py-2 border ${
							errors.title ? "border-gray-900" : "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
					/>
					{errors.title && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.title}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="company"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Company *
					</label>
					<input
						type="text"
						id="company"
						name="company"
						value={formData.company}
						onChange={handleChange}
						className={`w-full px-3 py-2 border ${
							errors.company
								? "border-gray-900"
								: "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
					/>
					{errors.company && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.company}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="type"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Job Type *
					</label>
					<select
						id="type"
						name="type"
						value={formData.type}
						onChange={handleChange}
						className={`w-full px-3 py-2 border ${
							errors.type ? "border-gray-900" : "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white`}
					>
						<option value="">Select job type</option>
						<option value="Internship">Internship</option>
						<option value="Full-time">Full-time</option>
					</select>
					{errors.type && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.type}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="url"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Application URL *
					</label>
					<input
						type="url"
						id="url"
						name="url"
						value={formData.url}
						onChange={handleChange}
						placeholder="https://..."
						className={`w-full px-3 py-2 border ${
							errors.url ? "border-gray-900" : "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
					/>
					{errors.url && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.url}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="applicationDeadline"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Application Deadline *
					</label>
					<input
						type="date"
						id="applicationDeadline"
						name="applicationDeadline"
						value={formData.applicationDeadline}
						onChange={handleChange}
						className={`w-full px-3 py-2 border ${
							errors.applicationDeadline
								? "border-gray-900"
								: "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
					/>
					{errors.applicationDeadline && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.applicationDeadline}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Job Description *
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={5}
						className={`w-full px-3 py-2 border ${
							errors.description
								? "border-gray-900"
								: "border-gray-300"
						} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
					/>
					{errors.description && (
						<p className="mt-1 text-sm text-gray-900">
							{errors.description}
						</p>
					)}
				</div>

				<div className="flex items-center justify-end space-x-3 pt-4">
					<button
						type="button"
						className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
						onClick={() =>
							setFormData({
								title: "",
								description: "",
								company: "",
								url: "",
								type: "",
								applicationDeadline: "",
							})
						}
					>
						Clear
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 border border-transparent rounded-md font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
					>
						{isSubmitting ? "Submitting..." : "Post Job"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default JobsForm;
