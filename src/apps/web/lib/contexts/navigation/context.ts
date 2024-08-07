import { createContext } from "react";

import { Route } from "@web/lib/types/route";

export interface NavigationCTXProps {
	activePage: Route | null;
	routes: Route[];
}

export const NavigationCTX = createContext({} as NavigationCTXProps);
