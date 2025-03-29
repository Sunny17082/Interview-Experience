import React, { useState, useEffect } from "react";

const SearchFilterSidebar = ({
	experiences,
	setFilteredExperiences,
	originalExperiences,
}) => {
	// State for all filter values
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [packageRange, setPackageRange] = useState({ min: "", max: "" });
	const [selectedStatuses, setSelectedStatuses] = useState([]);
	const [roundsRange, setRoundsRange] = useState({ min: "", max: "" });
	const [selectedTopics, setSelectedTopics] = useState([]);

	// Extract unique values for filter options
	const companies = [...new Set(experiences.map((exp) => exp.companyName))];
	const roles = [...new Set(experiences.map((exp) => exp.role))];
	const statuses = [
		...new Set(experiences.map((exp) => exp.interviewStatus)),
	];

	// Extract topics from all rounds
	const allTopics = [];
	experiences.forEach((exp) => {
		exp.rounds.forEach((round) => {
			if (round.topics) {
				round.topics.forEach((topic) => {
					if (!allTopics.includes(topic)) {
						allTopics.push(topic);
					}
				});
			}
		});
	});

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
		selectedTopics,
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

		// Apply topics filter
		if (selectedTopics.length > 0) {
			filteredResults = filteredResults.filter((exp) => {
				// Check if any of the rounds contain any of the selected topics
				return exp.rounds.some((round) => {
					if (!round.topics) return false;
					return round.topics.some((topic) =>
						selectedTopics.includes(topic)
					);
				});
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

	const toggleTopic = (topic) => {
		setSelectedTopics((prev) =>
			prev.includes(topic)
				? prev.filter((t) => t !== topic)
				: [...prev, topic]
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
		setSelectedTopics([]);
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

			{/* Companies Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">Companies</h3>
				<div className="space-y-1 max-h-32 overflow-y-auto">
					{companies.map((company) => (
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
				</div>
			</div>

			{/* Roles Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">Roles</h3>
				<div className="space-y-1 max-h-32 overflow-y-auto">
					{roles.map((role) => (
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

			{/* Topics Filter */}
			<div className="mb-5">
				<h3 className="font-semibold text-gray-800 mb-2">Topics</h3>
				<div className="space-y-1 max-h-32 overflow-y-auto">
					{allTopics.map((topic) => (
						<div key={topic} className="flex items-center">
							<input
								id={`topic-${topic}`}
								type="checkbox"
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								checked={selectedTopics.includes(topic)}
								onChange={() => toggleTopic(topic)}
							/>
							<label
								htmlFor={`topic-${topic}`}
								className="ml-2 text-sm text-gray-700"
							>
								{topic}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SearchFilterSidebar;
