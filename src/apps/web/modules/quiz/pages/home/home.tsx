import { createRef, useContext } from "react";

import Button from "@web/components/button";
import Code from "@web/components/code";
import Divider from "@web/components/divider";
import Flex from "@web/components/flex";
import Page from "@web/components/page";
import QuizList from "@web/components/quiz/list";
import QuizSelectionModal, {
	QuizSelectionModalHandlers,
} from "@web/components/quiz/modals/selection-modal";
import Text from "@web/components/text";

import { QuizCTX } from "@web/lib/contexts/quiz";

import styles from "./styles.module.scss";

const QuizzerHome = () => {
	const { quizzes } = useContext(QuizCTX);

	const quizSelectionModalRef = createRef<QuizSelectionModalHandlers>();

	const handleSelectQuiz = () => {
		quizSelectionModalRef.current?.open();
	};

	return (
		<Page className={styles.page}>
			<Text.Title className={styles.subtitle} level={2}>
				Easy quizzes with
				<br /> a single file
			</Text.Title>
			<Flex gap={16} vertical>
				<Text>
					Select simple <Code compact>.JSON</Code> files and generate complete
					quizzes quickly.
				</Text>
				<Button
					className={styles.ctaButton}
					color="primary"
					onClick={handleSelectQuiz}
				>
					Get Started
				</Button>
				<Divider />
				<QuizList
					data={quizzes}
					title={<Text.Title level={2}>Registered Quizzes:</Text.Title>}
				/>
			</Flex>
			<QuizSelectionModal ref={quizSelectionModalRef} />
		</Page>
	);
};

export default QuizzerHome;
