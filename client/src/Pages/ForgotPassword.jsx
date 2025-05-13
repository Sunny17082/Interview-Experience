import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState({
		loading: false,
		success: false,
		message: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus({ loading: true, success: false, message: "" });

		try {
			const response = await axios.post("/user/forgot-password", {
				email,
			});

			if (response.data.success) {
				setStatus({
					loading: false,
					success: true,
					message:
						"Password reset link sent successfully. Please check your email.",
				});
				setEmail("");
			}
		} catch (error) {
			setStatus({
				loading: false,
				success: false,
				message:
					error.response?.data?.message ||
					"Failed to send reset link. Please try again.",
			});
		} 
	};

	return (
		<div className="flex items-center justify-center h-auto my-20">
			<div className="w-full max-w-md p-8 space-y-6 rounded-lg">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800">
						Forgot Password
					</h2>
					<p className="mt-2 text-gray-600">
						Enter your email address to receive a password reset
						link
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
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
							placeholder="Enter your email"
						/>
					</div>

					<button
						type="submit"
						disabled={status.loading}
						className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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
								Sending...
							</>
						) : (
							"Send Reset Link"
						)}
					</button>
				</form>

				<div className="text-center space-y-2">
					<p className="text-sm text-gray-600">
						Remember your password?{" "}
						<Link
							to="/login"
							className="font-medium text-gray-500 hover:text-black"
						>
							Log in
						</Link>
					</p>
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-medium text-gray-500 hover:text-black"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
