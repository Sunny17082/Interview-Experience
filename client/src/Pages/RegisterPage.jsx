import axios from "axios";
import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	async function register(ev) {
		ev.preventDefault();
		setErrors({});
		try {
			const response = await axios.post(
				"/user/auth/register",
				{ email, name, password },
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			if (response.status === 201) {
				toast.success(
					"Registration successful! Please verify your email."
				);
			}
		} catch (err) {
			if (err.response && err.response.data && err.response.data.errors) {
				const formattedErrors = {};
				err.response.data.errors.forEach((error) => {
					formattedErrors[error.path] = error.msg;
				});
				setErrors(formattedErrors);
			} else {
				console.log(err.message);
				toast.error("An error occurred. Please try again later.");
			}
		}
	}

	function handleGoogleSignUp() {
		window.location.href = `${
			import.meta.env.VITE_API_BASE_URL
		}/user/auth/google`;
	}

	function togglePasswordVisibility() {
		setShowPassword(!showPassword);
	}

	return (
		<div className="my-16 mx-auto max-w-md px-4 sm:px-6 lg:px-8">
			<div className="space-y-8">
				<div>
					<h2 className="text-3xl font-bold text-center text-gray-900">
						Register
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={register}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								name="Email"
								type="Email"
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
								placeholder="Enter your email"
								value={email}
								onChange={(ev) => setEmail(ev.target.value)}
							/>
							{errors.email && (
								<p className="text-red-500 text-xs mt-1">
									{errors.email}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								name="name"
								type="text"
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
								placeholder="Enter your name"
								value={name}
								onChange={(ev) => setName(ev.target.value)}
							/>
							{errors.name && (
								<p className="text-red-500 text-xs mt-1">
									{errors.name}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="relative mt-1">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
									placeholder="Enter your password"
									value={password}
									onChange={(ev) =>
										setPassword(ev.target.value)
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={togglePasswordVisibility}
								>
									{showPassword ? (
										<FaEyeSlash className="h-5 w-5 text-gray-500" />
									) : (
										<FaEye className="h-5 w-5 text-gray-500" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-red-500 text-xs mt-1">
									{errors.password}
								</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm cursor-pointer text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						>
							Register
						</button>
					</div>
				</form>
				<div className="text-sm text-center">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-medium text-gray-600 hover:text-gray-500"
					>
						Sign in
					</Link>
				</div>
				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or continue with
							</span>
						</div>
					</div>
					<div className="mt-6">
						<button
							onClick={handleGoogleSignUp}
							className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm cursor-pointer font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						>
							<FaGoogle className="mr-2" />
							Sign up with Google
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
