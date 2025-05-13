import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
	const { token } = useParams();
	const [verificationStatus, setVerificationStatus] = useState({
		loading: true,
		success: false,
		message: "",
	});
	const navigate = useNavigate();

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await axios.get(`/user/verify-email/${token}`);

				if (response.data.success) {
					setVerificationStatus({
						loading: false,
						success: true,
						message: "Email verified successfully!",
					});

					// Auto redirect to login after successful verification
					setTimeout(() => {
						navigate("/login");
					}, 3000);
				}
			} catch (error) {
				setVerificationStatus({
					loading: false,
					success: false,
					message:
						error.response?.data?.message ||
						"Verification failed. Invalid or expired token.",
				});
			}
		};

		if (token) {
			verifyEmail();
		} else {
			setVerificationStatus({
				loading: false,
				success: false,
				message: "Verification token is missing.",
			});
		}
	}, [token, navigate]);

	return (
		<div className="flex items-center justify-center h-auto my-20">
			<div className="w-full max-w-md p-8 space-y-6 rounded-lg">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800">
						Email Verification
					</h2>

					{verificationStatus.loading ? (
						<div className="mt-6">
							<div className="flex justify-center">
								<div className="w-12 h-12 border-4 border-t-black border-b-black rounded-full animate-spin"></div>
							</div>
							<p className="mt-4 text-gray-600">
								Verifying your email...
							</p>
						</div>
					) : (
						<div className="mt-6">
							{verificationStatus.success ? (
								<div className="space-y-4">
									<div className="flex justify-center">
										<div className="p-2 bg-green-100 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-12 h-12 text-green-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									</div>
									<p className="text-lg font-medium text-green-600">
										{verificationStatus.message}
									</p>
									<p className="text-gray-600">
										Redirecting you to login page in a few
										seconds...
									</p>
									<Link
										to="/login"
										className="inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black"
									>
										Go to Login
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									<div className="flex justify-center">
										<div className="p-2 bg-red-100 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-12 h-12 text-red-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</div>
									</div>
									<p className="text-lg font-medium text-red-600">
										{verificationStatus.message}
									</p>
									<div className="space-y-2">
										<p className="text-gray-600">
											You can request a new verification
											email
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VerifyEmail;
