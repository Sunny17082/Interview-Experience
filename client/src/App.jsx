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

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<IndexPage />} />
					<Route path={"/login"} element={<LoginPage />} />
					<Route path={"/register"} element={<RegisterPage />} />
					<Route path={"/experience"} element={<ExperiencesPage />} />
					<Route path={"/experience/new"} element={<ExperienceForm />} />
					<Route path={"/experience/:id"} element={<ExperiencePage />} />
					<Route path={"/company/new"} element={<CompanyForm />} />
					<Route path={"/companies"} element={<CompaniesPage />} />
					<Route path={"/companies/:id"} element={<CompanyPage />} />
					<Route path={"/discussion/new"} element={<DiscussionForm />} />
					<Route path={"/discussion"} element={<DiscussionsPage />} />
					<Route path={"/discussion/:id"} element={<DiscussionPage />} />
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;


