import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ExperienceForm from "./Pages/ExperienceForm";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ExperiencesPage from "./Pages/ExperiencesPage";
import ExperiencePage from "./Pages/ExperiencePage";
import CompanyForm from "./Pages/CompanyForm";
import CompaniesPage from "./Pages/CompaniesPage";
import CompanyPage from "./Pages/CompanyPage";
import DiscussionForm from "./Pages/DiscussionForm";
import DiscussionPage from "./Pages/DiscussionPage";
import DiscussionsPage from "./Pages/DiscussionsPage";
import ResourcePage from "./Pages/ResourcePage";
import ResourceForm from "./Pages/ResourceForm";
import Dashboard from "./Pages/Dashboard";
import JobsForm from "./Pages/JobsForm";
import JobsPage from "./Pages/JobsPage";
import ProfilePage from "./Pages/ProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import VerifyEmail from "./Pages/VerifyEmail";
import ScrollToTop from "./Components/ScrollToTop";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<IndexPage />} />
					<Route path={"/login"} element={<LoginPage />} />
					<Route path={"/register"} element={<RegisterPage />} />
					<Route path={"/experience"} element={<ExperiencesPage />} />
					<Route
						path={"/experience/new"}
						element={<ExperienceForm />}
					/>
					<Route
						path={"/experience/edit/:id"}
						element={<ExperienceForm />}
					/>
					<Route
						path={"/experience/:id"}
						element={<ExperiencePage />}
					/>
					<Route path={"/company/new"} element={<CompanyForm />} />
					<Route
						path={"/company/edit/:id"}
						element={<CompanyForm />}
					/>
					<Route path={"/companies"} element={<CompaniesPage />} />
					<Route path={"/companies/:id"} element={<CompanyPage />} />
					<Route
						path={"/discussion/new"}
						element={<DiscussionForm />}
					/>
					<Route path={"/discussion"} element={<DiscussionsPage />} />
					<Route
						path={"/discussion/:id"}
						element={<DiscussionPage />}
					/>
					<Route path={"/resources"} element={<ResourcePage />} />
					<Route path={"/resources/new"} element={<ResourceForm />} />
					<Route path={"/jobs"} element={<JobsPage />} />
					<Route path={"/jobs/new"} element={<JobsForm />} />
					<Route path={"/profile/:id"} element={<ProfilePage />} />
					<Route
						path={"/forgotpassword"}
						element={<ForgotPassword />}
					/>
					<Route
						path={"/resetpassword/:token"}
						element={<ResetPassword />}
					/>
					<Route
						path={"/verifyemail/:token"}
						element={<VerifyEmail />}
					/>
				</Route>
				<Route path={"/dashboard"} element={<Dashboard />} />
			</Routes>
		</UserContextProvider>
	);
}

export default App;
