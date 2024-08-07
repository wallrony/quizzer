import { createContext } from "react";

import { Quiz } from "@core/domain/types/quiz/quiz";

interface Props {
	quizzes: Quiz[];
	activeQuiz: Quiz | null;
	setActiveQuiz: (quiz: Quiz) => void;
	clearActiveQuiz: () => void;
}

export const QuizCTX = createContext({} as Props);
