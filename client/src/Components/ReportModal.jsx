import React, { useState } from "react";
import { X, Flag, AlertTriangle } from "lucide-react";

const ReportModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [selectedReason, setSelectedReason] = useState("");
	const [additionalDetails, setAdditionalDetails] = useState("");

	const reportReasons = [
		{
			value: "spam",
			label: "Spam",
			description: "Repetitive, unwanted, or promotional content",
		},
		{
			value: "inappropriate_content",
			label: "Inappropriate Content",
			description: "Content that violates community guidelines",
		},
		{
			value: "offensive_language",
			label: "Offensive Language",
			description: "Hate speech, harassment, or abusive language",
		},
		{
			value: "misleading_information",
			label: "Misleading Information",
			description:
				"False or deceptive information about the interview experience",
		},
		{
			value: "privacy_violation",
			label: "Privacy Violation",
			description: "Sharing personal information without consent",
		},
		{
			value: "duplicate_content",
			label: "Duplicate Content",
			description: "This experience has already been shared",
		},
		{
			value: "other",
			label: "Other",
			description: "Other reasons not listed above",
		},
	];

	const handleSubmit = () => {
		if (!selectedReason) return;

		onSubmit({
			reason: selectedReason,
			details: additionalDetails.trim(),
		});
	};

	const handleClose = () => {
		setSelectedReason("");
		setAdditionalDetails("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center">
						<Flag className="h-5 w-5 text-red-500 mr-2" />
						<h3 className="text-lg font-semibold text-gray-900">
							Report Experience
						</h3>
					</div>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					<div className="mb-4">
						<div className="flex items-center mb-2">
							<AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
							<p className="text-sm text-gray-600">
								Help us understand what's wrong with this
								experience
							</p>
						</div>
					</div>

					{/* Reason Selection */}
					<div className="space-y-3 mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Select a reason for reporting:
						</label>
						{reportReasons.map((reason) => (
							<label
								key={reason.value}
								className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
									selectedReason === reason.value
										? "border-red-500 bg-red-50"
										: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
								}`}
							>
								<div className="flex items-start">
									<input
										type="radio"
										name="reason"
										value={reason.value}
										checked={
											selectedReason === reason.value
										}
										onChange={(e) =>
											setSelectedReason(e.target.value)
										}
										className="mt-1 mr-3 text-red-600 focus:ring-red-500"
									/>
									<div className="flex-1">
										<div className="font-medium text-gray-900 text-sm">
											{reason.label}
										</div>
										<div className="text-xs text-gray-500 mt-1">
											{reason.description}
										</div>
									</div>
								</div>
							</label>
						))}
					</div>

					{/* Additional Details */}
					<div className="mb-6">
						<label
							htmlFor="details"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Additional details (optional)
						</label>
						<textarea
							id="details"
							rows={3}
							value={additionalDetails}
							onChange={(e) =>
								setAdditionalDetails(e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
							placeholder="Provide more context about the issue..."
							maxLength={500}
						/>
						<div className="text-xs text-gray-500 mt-1">
							{additionalDetails.length}/500 characters
						</div>
					</div>

					{/* Actions */}
					<div className="flex space-x-3">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!selectedReason || isLoading}
							className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin h-4 w-4 mr-2"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Submitting...
								</>
							) : (
								"Submit Report"
							)}
						</button>
					</div>

					{/* Disclaimer */}
					<div className="mt-4 p-3 bg-gray-50 rounded-md">
						<p className="text-xs text-gray-600">
							<strong>Note:</strong> False reports may result in
							action against your account. Reports are reviewed by
							our moderation team and appropriate action will be
							taken if violations are found.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReportModal;