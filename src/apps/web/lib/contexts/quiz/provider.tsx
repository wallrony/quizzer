import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import useLocalStorage from "use-local-storage";

import { Quiz } from "@core/domain/types/quiz/quiz";

import { QuizCTX } from "./context";

const QUIZZES_KEY = "QUIZZER@USER_QUIZZES_KEY";

const QuizProvider = ({ children }: PropsWithChildren) => {
	const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>(QUIZZES_KEY, [], {
		parser: (rawContent: string) => {
			try {
				return JSON.parse(rawContent);
			} catch {
				return [];
			}
		},
	});

	const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

	const handleSetActiveQuiz = useCallback(
		(data: Quiz) => {
			setActiveQuiz(data);
			const newQuizzesList = [...(quizzes ?? [])];
			const quizIndex = newQuizzesList.findIndex((quiz) => quiz.id === data.id);
			if (quizIndex >= 0) {
				newQuizzesList[quizIndex] = data;
			} else {
				newQuizzesList.push(data);
			}
			setQuizzes(newQuizzesList);
		},
		[quizzes, setQuizzes]
	);

	const clearActiveQuiz = () => setActiveQuiz(null);

	const value = useMemo(
		() => ({
			quizzes,
			activeQuiz,
			setActiveQuiz: handleSetActiveQuiz,
			clearActiveQuiz,
		}),
		[activeQuiz, handleSetActiveQuiz, quizzes]
	);

	return <QuizCTX.Provider value={value}>{children}</QuizCTX.Provider>;
};

export { QuizProvider };
