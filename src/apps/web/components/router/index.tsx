import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { Route as RouteType } from "@web/lib/types/route";

import { NavigationCTX } from "../../lib/contexts/navigation/context";

const Router = () => {
	const { routes } = useContext(NavigationCTX);

	return (
		<Routes>
			{routes.map((route: RouteType) => (
				<Route key={route.path} path={route.path} element={route.page} />
			))}
		</Routes>
	);
};

export default Router;
