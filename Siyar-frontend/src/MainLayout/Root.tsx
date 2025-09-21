import { Outlet } from "react-router";
import Navbar from "../Components/Shared/Navbar/Navbar";
import Footer from "../Components/Shared/Footer/Footer";
import ScrollToTop from "../Components/Shared/ScrollToTop";
import { useAppSelector } from "../Redux/hook";
import { useEffect } from "react";

const Root = () => {
	const { dir, current } = useAppSelector((s) => s.language);

	useEffect(() => {
		document.documentElement.dir = dir;
		document.documentElement.lang = current;
	}, [dir, current]);
	return (
		<div>
			<ScrollToTop />
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Root;