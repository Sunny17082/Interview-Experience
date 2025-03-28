import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Layout = () => {
	return (
		<>
			<Header />
			<Outlet />
			<ToastContainer theme={"dark"} className={"mt-14"} />
			<Footer />
		</>
	);
};

export default Layout;
