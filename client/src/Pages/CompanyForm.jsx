import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CompanyForm = () => {
	const [company, setCompany] = useState({
		name: "",
		logo: "",
		roles: [{ role: "", package: "", information: "" }],
		links: "",
		eligibility: {
			classX: "",
			classXII: "",
			graduation: "",
			branch: [],
			backlogs: "",
			gap: "",
		},
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCompany({ ...company, [name]: value });
	};

	const handleEligibilityChange = (e) => {
		const { name, value } = e.target;
		setCompany({
			...company,
			eligibility: { ...company.eligibility, [name]: value },
		});
	};

	const handleBranchChange = (e) => {
		const { value } = e.target;
		const branchArray = value.split(",").map((branch) => branch.trim());
		setCompany({
			...company,
			eligibility: { ...company.eligibility, branch: branchArray },
		});
	};

	const handleRoleChange = (index, e) => {
		const { name, value } = e.target;
		const updatedRoles = [...company.roles];
		updatedRoles[index] = { ...updatedRoles[index], [name]: value };
		setCompany({ ...company, roles: updatedRoles });
	};

	const addRole = () => {
		setCompany({
			...company,
			roles: [
				...company.roles,
				{ role: "", package: "", information: "" },
			],
		});
	};

	const removeRole = (index) => {
		const updatedRoles = [...company.roles];
		updatedRoles.splice(index, 1);
		setCompany({ ...company, roles: updatedRoles });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/company", company, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
			});
			if (response.status === 201) {
				toast.success("Company information submitted successfully!");
				setCompany({
					name: "",
					logo: "",
					roles: [{ role: "", package: "", information: "" }],
					links: "",
					linkedIn: "",
					eligibility: {
						classX: "",
						classXII: "",
						graduation: "",
						branch: [],
						backlogs: "",
						gap: "",
					},
				});
			} else {
				toast.error("Failed to submit company information.");
			}
		} catch (err) {
			toast.error("An error occurred while submitting the form.");
			console.error(err);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto bg-white p-8 shadow-md">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				Company Information
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Info Section */}
				<div className="border-b border-gray-200 pb-6">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Basic Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Company Name*
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								value={company.name}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
							/>
						</div>

						<div>
							<label
								htmlFor="logo"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Logo URL*
							</label>
							<input
								type="text"
								id="logo"
								name="logo"
								required
								value={company.logo}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
							/>
						</div>
					</div>

					<div className="mt-4">
						<label
							htmlFor="links"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Company Links
						</label>
						<input
							type="text"
							id="links"
							name="links"
							value={company.links}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
							placeholder="Website, LinkedIn, etc"
						/>
					</div>
				</div>

				{/* Roles Section */}
				<div className="border-b border-gray-200 pb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-gray-700">
							Roles
						</h2>
						<button
							type="button"
							onClick={addRole}
							className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none"
						>
							Add Role
						</button>
					</div>

					{company.roles.map((role, index) => (
						<div
							key={index}
							className="bg-gray-50 p-4 rounded mb-4"
						>
							<div className="flex justify-between items-center mb-2">
								<h3 className="text-lg font-medium text-gray-700">
									Role {index + 1}
								</h3>
								{company.roles.length > 1 && (
									<button
										type="button"
										onClick={() => removeRole(index)}
										className="text-red-600 hover:text-red-800"
									>
										Remove
									</button>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Role Title
									</label>
									<input
										type="text"
										name="role"
										value={role.role}
										onChange={(e) =>
											handleRoleChange(index, e)
										}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Package
									</label>
									<input
										type="text"
										name="package"
										value={role.package}
										onChange={(e) =>
											handleRoleChange(index, e)
										}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
									/>
								</div>
							</div>

							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Additional Information
								</label>
								<textarea
									name="information"
									value={role.information}
									onChange={(e) => handleRoleChange(index, e)}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
									rows="3"
								></textarea>
							</div>
						</div>
					))}
				</div>

				{/* Eligibility Section */}
				<div>
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Eligibility Criteria
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div>
							<label
								htmlFor="classX"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Class X (%)
							</label>
							<input
								type="number"
								id="classX"
								name="classX"
								value={company.eligibility.classX}
								onChange={handleEligibilityChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
								min="0"
								max="100"
							/>
						</div>

						<div>
							<label
								htmlFor="classXII"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Class XII (%)
							</label>
							<input
								type="number"
								id="classXII"
								name="classXII"
								value={company.eligibility.classXII}
								onChange={handleEligibilityChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
								min="0"
								max="100"
							/>
						</div>

						<div>
							<label
								htmlFor="graduation"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Graduation (%)
							</label>
							<input
								type="number"
								id="graduation"
								name="graduation"
								value={company.eligibility.graduation}
								onChange={handleEligibilityChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
								min="0"
								max="100"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="branch"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Eligible Branches (comma-separated)
							</label>
							<input
								type="text"
								id="branch"
								name="branch"
								value={company.eligibility.branch.join(", ")}
								onChange={handleBranchChange}
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
								placeholder="CS, IT, ECE, etc."
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="backlogs"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Max Backlogs
								</label>
								<input
									type="number"
									id="backlogs"
									name="backlogs"
									value={company.eligibility.backlogs}
									onChange={handleEligibilityChange}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
									min="0"
								/>
							</div>

							<div>
								<label
									htmlFor="gap"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Max Education Gap (years)
								</label>
								<input
									type="number"
									id="gap"
									name="gap"
									value={company.eligibility.gap}
									onChange={handleEligibilityChange}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
									min="0"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default CompanyForm;
