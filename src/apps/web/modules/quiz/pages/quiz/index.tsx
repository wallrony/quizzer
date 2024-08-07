import { useContext, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Page from "@web/components/page";
import ActiveQuiz from "@web/components/quiz";
import { QuizCTX } from "@web/lib/contexts/quiz/context";

import styles from "./styles.module.scss";

const QuizPage = () => {
	const navigate = useNavigate();
	const { quizzes, activeQuiz, setActiveQuiz } = useContext(QuizCTX);

	const { id } = useParams<{ id?: string }>();

	const goToHome = () => navigate("/");

	useEffect(() => {
		if (!id) {
			goToHome();
			return;
		}
		const quiz = quizzes.find((quiz) => quiz.id === id);
		if (quiz) {
			setActiveQuiz(quiz);
		} else {
			goToHome();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!activeQuiz) {
		return null;
	}

	return (
		<Page className={styles.quizPage}>
			<ActiveQuiz quiz={activeQuiz} />
		</Page>
	);
};

export default QuizPage;
