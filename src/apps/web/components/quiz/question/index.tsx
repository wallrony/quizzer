import { isNil } from "lodash";
import { useState } from "react";

import { QuestionAnswer } from "@core/domain/types/quiz/answer";
import { Question as QuestionType } from "@core/domain/types/quiz/question";
import Button from "@web/components/button";
import Flex from "@web/components/flex";
import Text from "@web/components/text";

import QuestionInput from "./input";
import styles from "./styles.module.scss";

interface Props {
	data: QuestionType;
	answer: QuestionAnswer["answer"] | null;
	isFirstQuestion: boolean;
	isLastQuestion: boolean;
	onNext: (answer: QuestionAnswer["answer"]) => void;
	onPrevious?: () => void;
}

const Question = ({
	data,
	answer,
	isFirstQuestion = false,
	isLastQuestion = false,
	onNext,
	onPrevious,
}: Props) => {
	const [newAnswer, setNewAnswer] = useState<QuestionAnswer["answer"] | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	const onAnswer = (result: QuestionAnswer["answer"]) => {
		setNewAnswer(result);
	};

	const handlePrevious = () => {
		if (onPrevious) {
			setNewAnswer(null);
			onPrevious?.();
		}
	};

	const handleNext = () => {
		if (!newAnswer && !answer && newAnswer !== 0 && answer !== 0) {
			setError("Please answer the question before proceeding.");
			return;
		}
		setError(null);
		if (!isNil(newAnswer)) {
			onNext(newAnswer);
		} else if (!isNil(answer)) {
			onNext(answer);
		}
		setNewAnswer(null);
	};

	return (
		<Flex gap={16} vertical>
			<Flex gap={8} vertical>
				<Text.Title level={3}>{data.title}</Text.Title>
				{data.image && (
					<img className={styles.quizImage} src={data.image} alt="Question" />
				)}
				{data.description && <Text>{data.description}</Text>}
			</Flex>
			<QuestionInput
				id={data.id}
				type={data.type}
				options={data.options}
				answer={newAnswer ?? answer}
				onAnswer={onAnswer}
			/>
			<Text className={styles.errorFeedback}>{error}</Text>
			<Flex gap={8} justify="space-between">
				<Button
					color={isFirstQuestion ? "danger" : "default"}
					onClick={handlePrevious}
				>
					{isFirstQuestion ? "Cancel" : "Previous"}
				</Button>
				<Button
					className={styles.nextButton}
					color="primary"
					onClick={handleNext}
				>
					{isLastQuestion ? "Finish" : "Next"}
				</Button>
			</Flex>
		</Flex>
	);
};

export default Question;
