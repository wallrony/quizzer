import useLocalStorage from "use-local-storage";

import { Answer } from "@core/domain/types/quiz/answer";

const ANSWERS_KEY = "QUIZZER@ANSWERS";

export const useAnswers = () => {
	const [answers, setAnswers] = useLocalStorage<Answer[]>(ANSWERS_KEY, []);

	const addAnswer = (answer: Answer) => {
		const newAnswers = answers.filter(
			(eachAnswer) => eachAnswer.quizId !== answer.quizId
		);
		setAnswers([...newAnswers, answer]);
	};

	const getByQuiz = (quizId: string) =>
		answers.find((answer) => answer.quizId === quizId);

	const clearAnswers = () => setAnswers([]);

	return {
		answers,
		addAnswer,
		getByQuiz,
		clearAnswers,
	};
};
