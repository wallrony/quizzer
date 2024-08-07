import classNames from "classnames";

import { isEqual } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { QuestionAnswer } from "@core/domain/types/quiz/answer";
import { Quiz } from "@core/domain/types/quiz/quiz";
import { useAnswers } from "@web/lib/hooks/use-answers";
import { useDuration } from "@web/lib/hooks/use-transition";

import Question from "./question";
import styles from "./styles.module.scss";
import Button from "../button";
import Flex from "../flex";
import ProgressBar from "../progress-bar";
import Text from "../text";

interface Props {
	quiz: Quiz;
}

const ActiveQuiz = ({ quiz }: Props) => {
	const navigate = useNavigate();
	const { addAnswer } = useAnswers();
	const [quizStarted, setQuizStarted] = useState(false);
	const [quizFinished, setQuizFinished] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const answers = useRef<QuestionAnswer[]>([]);
	const { executing, run } = useDuration();

	const handleGoToHome = useCallback(() => {
		navigate("/");
	}, [navigate]);

	const startQuiz = () => {
		setQuizStarted(true);
	};

	const questionCountProgress = useMemo(() => {
		if (!quiz) {
			return null;
		}
		const currentQuestionText =
			currentQuestion + 1 > quiz.questions.length
				? quiz.questions.length
				: currentQuestion + 1;
		let text = `question ${currentQuestionText} of ${quiz?.questions.length}`;
		if (!quizStarted) {
			text = `${quiz?.questions.length} Questions`;
		}
		return (
			<Flex gap={2} className={styles.questionCount} vertical>
				<Text.Span>{text}</Text.Span>
				{quizStarted && (
					<ProgressBar progress={currentQuestion} max={quiz.questions.length} />
				)}
			</Flex>
		);
	}, [quiz, currentQuestion, quizStarted]);

	const onNextQuestion = useCallback(
		(currentQuestionAnswer: QuestionAnswer["answer"]) =>
			run(() => {
				if (!quiz) {
					return;
				}
				const question = quiz.questions[currentQuestion];
				answers.current.push({
					questionId: question.id,
					answer: currentQuestionAnswer,
				});
				let nextQuestionIndex = currentQuestion + 1;
				if (question.actions) {
					const { jumpTo } = question.actions;
					if (jumpTo && isEqual(jumpTo.answer, currentQuestionAnswer)) {
						const jumpToQuestionIdx = quiz.questions.findIndex(
							(question, index) =>
								typeof jumpTo.question === "string"
									? jumpTo.question === question.id
									: jumpTo.question === index
						);
						if (
							jumpToQuestionIdx > currentQuestion &&
							jumpToQuestionIdx < quiz.questions.length
						) {
							nextQuestionIndex = jumpToQuestionIdx;
						}
					}
				}
				setCurrentQuestion(nextQuestionIndex);
				if (nextQuestionIndex === quiz.questions.length) {
					addAnswer({ quizId: quiz.id, answers: answers.current });
					setQuizFinished(true);
				}
			}, 250),
		[run, quiz, currentQuestion, addAnswer]
	);

	const onPreviousQuestion = useCallback(
		() =>
			run(() => {
				if (currentQuestion === 0) {
					handleGoToHome();
				}
				if (currentQuestion > 0) {
					setCurrentQuestion(currentQuestion - 1);
				}
			}, 250),
		[run, currentQuestion, handleGoToHome]
	);

	const content = useMemo(() => {
		if (!quiz) {
			return null;
		}
		if (!quizStarted) {
			return (
				<Flex gap={16} vertical>
					{quiz.image && (
						<img
							className={styles.quizImage}
							src={quiz.image}
							alt="Quiz root"
						/>
					)}
					<Text>{quiz.description}</Text>
					<Flex
						className={styles.rootQuizFooter}
						gap={16}
						justify="space-between"
					>
						<Button color="ghost" onClick={handleGoToHome}>
							Go to home
						</Button>
						<Button color="primary" onClick={() => run(startQuiz, 1000)}>
							Start!
						</Button>
					</Flex>
				</Flex>
			);
		}
		if (quizFinished) {
			return (
				<Flex gap={16} vertical>
					<Text.Title level={2}>Quiz Finished!</Text.Title>
					<Text>
						You have successfully completed the quiz. You can now go back to the
						home page and see your answers &#128513;.
					</Text>
					<Button color="primary" onClick={handleGoToHome}>
						Go to home
					</Button>
				</Flex>
			);
		}
		return (
			<>
				{quiz.questions.map((question, idx) => {
					const answer =
						answers.current.find((answer) => answer.questionId === question.id)
							?.answer ?? null;
					const questionIsActive = idx === currentQuestion;
					return (
						<div
							key={question.id}
							className={classNames(styles.questionWrapper, {
								[styles.active]: questionIsActive,
							})}
						>
							<Question
								data={question}
								answer={answer}
								onNext={onNextQuestion}
								onPrevious={onPreviousQuestion}
								isFirstQuestion={idx === 0}
								isLastQuestion={idx === quiz.questions.length - 1}
							/>
						</div>
					);
				})}
			</>
		);
	}, [
		answers,
		quiz,
		currentQuestion,
		handleGoToHome,
		onNextQuestion,
		onPreviousQuestion,
		quizStarted,
		quizFinished,
		run,
	]);

	if (!quiz) {
		return null;
	}

	return (
		<Flex className={styles.quizWrapper} gap={8} vertical>
			<Flex
				className={styles.quizHeader}
				gap={4}
				vertical
				align="baseline"
				justify="space-between"
			>
				<Text.Title className={styles.quizTitle} level={2}>
					{quiz.title}
				</Text.Title>
				{questionCountProgress}
			</Flex>
			<div
				className={classNames(styles.contentWrapper, {
					[styles.loading]: executing,
				})}
			>
				{content}
			</div>
		</Flex>
	);
};

export default ActiveQuiz;
