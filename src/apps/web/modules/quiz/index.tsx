import { Route } from "@web/lib/types/route";

import QuizzerHome from "./pages/home/home";
import QuizPage from "./pages/quiz";

export default function getRoutes(): Route[] {
	return [
		{
			title: "Home",
			path: "/",
			page: <QuizzerHome />,
		},
		{
			title: "Quiz",
			path: "/quiz/:id",
			page: <QuizPage />,
			hidden: true,
		},
	];
}
