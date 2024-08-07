import { useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import { QuizProvider } from "@web/lib/contexts/quiz";
import { Route } from "@web/lib/types/route";
import { getAllRoutes } from "@web/modules";

import styles from "./styles.module.scss";
import {
	NavigationCTX,
	NavigationCTXProps,
} from "../../lib/contexts/navigation/context";
import HeaderNavigator from "../header-navigator";
import Router from "../router";

const Scaffold = () => {
	const location = useLocation();

	const routes = useMemo(() => getAllRoutes(), []);
	const [activePage, setActivePage] = useState<Route | null>(
		() =>
			routes.find((route) => route.path === window.location.pathname) ?? null
	);

	useEffect(() => {
		const route =
			routes.find((route) => route.path === location.pathname) ?? null;
		setActivePage(route);
	}, [location.pathname, routes]);

	const navigationProps: NavigationCTXProps = useMemo(
		() => ({ routes, activePage }),
		[routes, activePage]
	);

	return (
		<NavigationCTX.Provider value={navigationProps}>
			<QuizProvider>
				<header className={styles.header}>
					<h1>Quizzer</h1>
					<HeaderNavigator />
				</header>
				<Router />
			</QuizProvider>
		</NavigationCTX.Provider>
	);
};

export default Scaffold;
