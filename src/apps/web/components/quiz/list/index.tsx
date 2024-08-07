import { isEmpty } from "lodash";

import { useMemo } from "react";

import { MdCheck } from "react-icons/md";

import { Quiz } from "@core/domain/types/quiz/quiz";
import Card from "@web/components/card";
import Flex from "@web/components/flex";
import Text from "@web/components/text";

import { useAnswers } from "@web/lib/hooks/use-answers";

import styles from "./styles.module.scss";

interface Props {
	data: Quiz[];
	title?: React.ReactNode;
}

const MAX_DESCRIPTION_CHAR_COUNT = 100;

const QuizList = ({ data, title }: Props) => {
	const { getByQuiz } = useAnswers();

	const content = useMemo(() => {
		if (isEmpty(data)) {
			return <Text>There are no registered quizzes yet &#128517;</Text>;
		}

		return (
			<div className={styles.quizGrid}>
				{data.map((quiz) => {
					const answer = getByQuiz(quiz.id);
					const croppedDescription = quiz.description.slice(
						0,
						MAX_DESCRIPTION_CHAR_COUNT
					);
					return (
						<Card key={quiz.id} className={styles.quizCard}>
							<Text.Title level={3}>{quiz.title}</Text.Title>
							<Text className={styles.quizDescription}>
								{croppedDescription}
								{quiz.description.length > MAX_DESCRIPTION_CHAR_COUNT
									? "..."
									: ""}
							</Text>
							{answer && (
								<Flex
									className={styles.answeredQuestionTag}
									gap={8}
									align="center"
								>
									<MdCheck color="mediumseagreen" />
									Already answered
								</Flex>
							)}
						</Card>
					);
				})}
			</div>
		);
	}, [data, getByQuiz]);

	return (
		<Flex gap={8} vertical>
			{title}
			{content}
		</Flex>
	);
};

export default QuizList;
