import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
				<h3 className="text-xl font-bold text-gray-900 mb-4">
					Confirm Deletion
				</h3>
				<p className="text-gray-700 mb-6">
					Are you sure you want to delete this {itemName || "item"}?
					This action cannot be undone.
				</p>
				<div className="flex justify-end space-x-3">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal;
