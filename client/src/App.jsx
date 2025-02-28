import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexPage from "./Pages/IndexPage"
import Layout from './Components/Layout';

function App() {

	return (
		<Routes>
			<Route path="/" element={<Layout />} >
				<Route index element={<IndexPage />} />
			</Route>
		</Routes>
	);
}

export default App;