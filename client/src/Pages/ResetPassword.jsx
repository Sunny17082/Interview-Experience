import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState({
		loading: false,
		success: false,
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (
			!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(
				formData.password
			)
		) {
			newErrors.password =
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setStatus({ loading: true, success: false, message: "" });

		try {
			const response = await axios.post(
				`/user/reset-password/${token}`,
				{
					password: formData.password,
				}
			);

			if (response.data.success) {
				setStatus({
					loading: false,
					success: true,
					message: "Password reset successfully!",
				});

				// Redirect to login page after successful password reset
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			}
		} catch (error) {
			setStatus({
				loading: false,
				success: false,
				message:
					error.response?.data?.message ||
					"Failed to reset password. The link may be invalid or expired.",
			});
		}
	};

	return (
		<div className="flex items-center justify-center h-auto my-20">
			<div className="w-full max-w-md p-8 space-y-6 rounded-lg">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800">
						Reset Your Password
					</h2>
					<p className="mt-2 text-gray-600">
						Enter a new password for your account
					</p>
				</div>

				{status.message && (
					<div
						className={`p-4 rounded-md ${
							status.success
								? "bg-green-50 text-green-700"
								: "bg-red-50 text-red-700"
						}`}
					>
						{status.message}
						{status.success && (
							<p className="mt-2 font-medium">
								Redirecting to login page in a few seconds...
							</p>
						)}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							New Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border ${
								errors.password
									? "border-red-500"
									: "border-gray-300"
							} rounded-md focus:outline-none focus:ring-black focus:border-black`}
							placeholder="Enter new password"
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">
								{errors.password}
							</p>
						)}
						<p className="mt-1 text-xs text-gray-500">
							Password must contain at least 8 characters, one
							uppercase letter, one lowercase letter, one number,
							and one special character.
						</p>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border ${
								errors.confirmPassword
									? "border-red-500"
									: "border-gray-300"
							} rounded-md focus:outline-none focus:ring-black focus:border-black`}
							placeholder="Confirm new password"
						/>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={status.loading || status.success}
						className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
					>
						{status.loading ? (
							<>
								<svg
									className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
									xmlns="http://www.w3.org/2000/svg"
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
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Resetting...
							</>
						) : (
							"Reset Password"
						)}
					</button>
				</form>

				<div className="text-center">
					<Link
						to="/login"
						className="text-sm font-medium text-gray-500 hover:text-black"
					>
						Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
