import React, { useState, useEffect } from "react";

const SearchFilterSidebar = ({
	experiences,
	setFilteredExperiences,
	originalExperiences,
	initialSearchTerm,
	showCompanyModal,
	setShowCompanyModal,
	showRoleModal,
	setShowRoleModal,
}) => {
	// State for all filter values
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [packageRange, setPackageRange] = useState({ min: "", max: "" });
	const [selectedStatuses, setSelectedStatuses] = useState([]);
	const [roundsRange, setRoundsRange] = useState({ min: "", max: "" });

	// Extract unique values for filter options
	const companies = [...new Set(experiences.map((exp) => exp.companyName))];
	const roles = [...new Set(experiences.map((exp) => exp.role))];
	const statuses = [
		...new Set(experiences.map((exp) => exp.interviewStatus)),
	];


	useEffect(() => {
		if (initialSearchTerm) {
			setSearchTerm(initialSearchTerm);
		}
	}, [initialSearchTerm]);

	// Apply filters whenever any filter value changes
	useEffect(() => {
		applyFilters();
	}, [
		searchTerm,
		selectedCompanies,
		selectedRoles,
		packageRange,
		selectedStatuses,
		roundsRange,
		originalExperiences,
	]);

	const applyFilters = () => {
		let filteredResults = [...originalExperiences];

		// Apply search filter
		if (searchTerm) {
			filteredResults = filteredResults.filter(
				(exp) =>
					exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					exp.companyName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					exp.role.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply company filter
		if (selectedCompanies.length > 0) {
			filteredResults = filteredResults.filter((exp) =>
				selectedCompanies.includes(exp.companyName)
			);
		}

		// Apply role filter
		if (selectedRoles.length > 0) {
			filteredResults = filteredResults.filter((exp) =>
				selectedRoles.includes(exp.role)
			);
		}

		// Apply package range filter
		if (packageRange.min !== "" || packageRange.max !== "") {
			filteredResults = filteredResults.filter((exp) => {
				const packageValue = parseFloat(exp.packageOffered);
				if (packageRange.min !== "" && packageRange.max !== "") {
					return (
						packageValue >= parseFloat(packageRange.min) &&
						packageValue <= parseFloat(packageRange.max)
					);
				} else if (packageRange.min !== "") {
					return packageValue >= parseFloat(packageRange.min);
				} else if (packageRange.max !== "") {
					return packageValue <= parseFloat(packageRange.max);
				}
				return true;
			});
		}

		// Apply status filter
		if (selectedStatuses.length > 0) {
			filteredResults = filteredResults.filter((exp) =>
				selectedStatuses.includes(exp.interviewStatus)
			);
		}

		// Apply rounds range filter
		if (roundsRange.min !== "" || roundsRange.max !== "") {
			filteredResults = filteredResults.filter((exp) => {
				const roundsCount = exp.rounds.length;
				if (roundsRange.min !== "" && roundsRange.max !== "") {
					return (
						roundsCount >= parseInt(roundsRange.min) &&
						roundsCount <= parseInt(roundsRange.max)
					);
				} else if (roundsRange.min !== "") {
					return roundsCount >= parseInt(roundsRange.min);
				} else if (roundsRange.max !== "") {
					return roundsCount <= parseInt(roundsRange.max);
				}
				return true;
			});
		}

		setFilteredExperiences(filteredResults);
	};

	// Toggle selection functions
	const toggleCompany = (company) => {
		setSelectedCompanies((prev) =>
			prev.includes(company)
				? prev.filter((c) => c !== company)
				: [...prev, company]
		);
	};

	const toggleRole = (role) => {
		setSelectedRoles((prev) =>
			prev.includes(role)
				? prev.filter((r) => r !== role)
				: [...prev, role]
		);
	};

	const toggleStatus = (status) => {
		setSelectedStatuses((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status]
		);
	};


	// Clear all filters
	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCompanies([]);
		setSelectedRoles([]);
		setPackageRange({ min: "", max: "" });
		setSelectedStatuses([]);
		setRoundsRange({ min: "", max: "" });
	};

	// Modal component for selections
	const SelectionModal = ({
		isOpen,
		onClose,
		title,
		items,
		selectedItems,
		toggleItem,
	}) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
				<div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-bold">{title}</h3>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700"
						>
							✕
						</button>
					</div>

					<div className="space-y-2 mb-4">
						{items.map((item) => (
							<div key={item} className="flex items-center">
								<input
									id={`modal-${item}`}
									type="checkbox"
									className="h-4 w-4 text-black border-gray-300 rounded"
									checked={selectedItems.includes(item)}
									onChange={() => toggleItem(item)}
								/>
								<label
									htmlFor={`modal-${item}`}
									className="ml-2 text-sm text-gray-700"
								>
									{item}
								</label>
							</div>
						))}
					</div>

					<div className="flex justify-end">
						<button
							onClick={onClose}
							className="bg-black text-white py-2 px-4 rounded-md"
						>
							Done
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 sticky top-4 max-h-screen overflow-y-auto">
			<h2 className="text-xl font-bold text-gray-900 mb-4">
				Filter Experiences
			</h2>

			{/* Search Bar */}
			<div className="mb-5">
				<label
					htmlFor="search"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Search
				</label>
				<input
					type="text"
					id="search"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					placeholder="Search by name, company..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Clear Filters Button */}
			<button
				onClick={clearFilters}
				className="w-full mb-5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-200"
			>
				Clear All Filters
			</button>

			{/* Companies Filter with View More */}
			<div className="mb-5">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-gray-800">Companies</h3>
					{companies.length > 3 && (
						<button
							onClick={() => setShowCompanyModal(true)}
							className="text-xs text-indigo-600 hover:text-indigo-800"
						>
							View All ({companies.length})
						</button>
					)}
				</div>
				<div className="space-y-1">
					{companies.slice(0, 3).map((company) => (
						<div key={company} className="flex items-center">
							<input
								id={`company-${company}`}
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								checked={selectedCompanies.includes(company)}
								onChange={() => toggleCompany(company)}
							/>
							<label
								htmlFor={`company-${company}`}
								className="ml-2 text-sm text-gray-700"
							>
								{company}
							</label>
						</div>
					))}
					{companies.length > 3 &&
						selectedCompanies.some(
							(company) =>
								!companies.slice(0, 3).includes(company)
						) && (
							<div className="text-xs text-gray-500 mt-1">
								+
								{
									selectedCompanies.filter(
										(company) =>
											!companies
												.slice(0, 3)
												.includes(company)
									).length
								}{" "}
								more selected
							</div>
						)}
				</div>
			</div>

			{/* Roles Filter with View More */}
			<div className="mb-5">
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-gray-800">Roles</h3>
					{roles.length > 3 && (
						<button
							onClick={() => setShowRoleModal(true)}
							className="text-xs text-indigo-600 hover:text-indigo-800"
						>
							View All ({roles.length})
						</button>
					)}
				</div>
				<div className="space-y-1">
					{roles.slice(0, 3).map((role) => (
						<div key={role} className="flex items-center">
							<input
								id={`role-${role}`}
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								checked={selectedRoles.includes(role)}
								onChange={() => toggleRole(role)}
							/>
							<label
								htmlFor={`role-${role}`}
								className="ml-2 text-sm text-gray-700"
							>
								{role}
							</label>
						</div>
					))}
					{roles.length > 3 &&
						selectedRoles.some(
							(role) => !roles.slice(0, 3).includes(role)
						) && (
							<div className="text-xs text-gray-500 mt-1">
								+
								{
									selectedRoles.filter(
										(role) =>
											!roles.slice(0, 3).includes(role)
									).length
								}{" "}
								more selected
							</div>
						)}
				</div>
			</div>

			{/* Package Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">
					Package (LPA)
				</h3>
				<div className="flex space-x-2">
					<input
						type="number"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="Min"
						value={packageRange.min}
						onChange={(e) =>
							setPackageRange({
								...packageRange,
								min: e.target.value,
							})
						}
					/>
					<input
						type="number"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="Max"
						value={packageRange.max}
						onChange={(e) =>
							setPackageRange({
								...packageRange,
								max: e.target.value,
							})
						}
					/>
				</div>
			</div>

			{/* Status Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">Status</h3>
				<div className="space-y-1">
					{statuses.map((status) => (
						<div key={status} className="flex items-center">
							<input
								id={`status-${status}`}
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								checked={selectedStatuses.includes(status)}
								onChange={() => toggleStatus(status)}
							/>
							<label
								htmlFor={`status-${status}`}
								className="ml-2 text-sm text-gray-700"
							>
								{status}
							</label>
						</div>
					))}
				</div>
			</div>

			{/* Rounds Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">Rounds</h3>
				<div className="flex space-x-2">
					<input
						type="number"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="Min"
						value={roundsRange.min}
						onChange={(e) =>
							setRoundsRange({
								...roundsRange,
								min: e.target.value,
							})
						}
					/>
					<input
						type="number"
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						placeholder="Max"
						value={roundsRange.max}
						onChange={(e) =>
							setRoundsRange({
								...roundsRange,
								max: e.target.value,
							})
						}
					/>
				</div>
			</div>

			{/* Company Selection Modal */}
			<SelectionModal
				isOpen={showCompanyModal}
				onClose={() => setShowCompanyModal(false)}
				title="Select Companies"
				items={companies}
				selectedItems={selectedCompanies}
				toggleItem={toggleCompany}
			/>

			{/* Role Selection Modal */}
			<SelectionModal
				isOpen={showRoleModal}
				onClose={() => setShowRoleModal(false)}
				title="Select Roles"
				items={roles}
				selectedItems={selectedRoles}
				toggleItem={toggleRole}
			/>
		</div>
	);
};

export default SearchFilterSidebar;
