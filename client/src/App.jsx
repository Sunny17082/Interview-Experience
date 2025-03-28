import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ExperienceForm from "./Pages/ExperienceForm";
import axios from "axios";
import { User } from "lucide-react";
import { UserContextProvider } from "./UserContext";

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
					<Route
						path={"/experience/new"}
						element={<ExperienceForm />}
					/>
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;
