import { isEmpty, isNil } from "lodash";
import {
	ForwardedRef,
	createRef,
	forwardRef,
	useCallback,
	useContext,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";

import { BsFiletypeJson } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
	DraftQuestion,
	QUESTION_TYPE_VALUES,
} from "@core/domain/types/quiz/question";
import { DraftQuiz, Quiz } from "@core/domain/types/quiz/quiz";
import Button from "@web/components/button";
import Code from "@web/components/code";
import Flex from "@web/components/flex";
import Text from "@web/components/text";

import { QuizCTX } from "@web/lib/contexts/quiz";

import styles from "./styles.module.scss";

interface Handlers {
	open: () => void;
}

const baseStructure: DraftQuiz = {
	title: "Quiz Title",
	description: "Quiz Description",
	questions: [
		{
			title: "Question Title",
			options: ["Option 1", "Option 2", "Option 3"],
			type: QUESTION_TYPE_VALUES.MultipleChoice,
			correctAnswer: [0],
			actions: {
				jumpTo: {
					answer: [1],
					question: "question-id-or-index",
				},
			},
		},
		{
			title: "Question Title",
			options: ["Option 1", "Option 2", "Option 3"],
			type: QUESTION_TYPE_VALUES.SingleChoice,
			correctAnswer: 0,
		},
		{
			title: "Question Title",
			options: null,
			type: QUESTION_TYPE_VALUES.CustomAnswer,
			correctAnswer: null,
		},
	],
};

const isValidMultipleChoiceQuestion = (question: DraftQuestion) =>
	question.title &&
	question.type === QUESTION_TYPE_VALUES.MultipleChoice &&
	question.options &&
	Array.isArray(question.options) &&
	!isNil(question.correctAnswer) &&
	Array.isArray(question.correctAnswer);

const isValidSingleChoiceQuestion = (question: DraftQuestion) =>
	question.title &&
	question.type === QUESTION_TYPE_VALUES.SingleChoice &&
	question.options &&
	Array.isArray(question.options) &&
	!isNil(question.correctAnswer) &&
	typeof question.correctAnswer === "number";

const isValidCustomAnswerQuestion = (question: DraftQuestion) =>
	question.title &&
	question.type === QUESTION_TYPE_VALUES.CustomAnswer &&
	isNil(question.options) &&
	isNil(question.correctAnswer);

const isValidQuestion = (question: DraftQuestion) =>
	isValidMultipleChoiceQuestion(question) ||
	isValidSingleChoiceQuestion(question) ||
	isValidCustomAnswerQuestion(question);

const validateContent = (content: string) => {
	const parsedContent = JSON.parse(content);
	if (
		!parsedContent ||
		!parsedContent.title ||
		!parsedContent.description ||
		!parsedContent.questions ||
		!Array.isArray(parsedContent.questions) ||
		parsedContent.questions.some(
			(question: DraftQuestion) => !isValidQuestion(question)
		)
	) {
		throw new Error("Invalid JSON structure. Verify your file and try again.");
	}
	if (!parsedContent.id) {
		parsedContent.id = uuidv4();
	}
	parsedContent.questions = parsedContent.questions.map(
		(question: DraftQuestion) => {
			if (!question.id) {
				return { ...question, id: uuidv4() };
			}
			return question;
		}
	);
	return parsedContent as Quiz;
};

const QuizSelectionModal = forwardRef<Handlers>(
	(_: unknown, ref: ForwardedRef<Handlers>) => {
		const navigate = useNavigate();
		const dialogRef = createRef<HTMLDialogElement>();
		const fileInputRef = createRef<HTMLInputElement>();
		const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
		const [selectionError, setSelectionError] = useState<string | null>(null);
		const { setActiveQuiz } = useContext(QuizCTX);

		const open = () => dialogRef.current?.showModal();

		const handleClose = () => {
			dialogRef.current?.close();
			setSelectedQuiz(null);
			setSelectionError(null);
		};

		const handleFindFile = useCallback(() => {
			setSelectionError(null);
			fileInputRef.current?.click();
		}, [fileInputRef]);

		const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files && !isEmpty(event.target.files)) {
				event.target.files[0]
					.text()
					.then(validateContent)
					.then((content) => {
						if (isNil(content)) {
							throw new Error(
								"Invalid JSON structure. Verify your file and try again."
							);
						}
						setSelectedQuiz(content);
					})
					.catch((error) => {
						setSelectionError(error.message);
					});
			}
		};

		const clearSelectedQuiz = () => {
			setSelectedQuiz(null);
		};

		const handleGenerateQuiz = useCallback(() => {
			if (!selectedQuiz) {
				return;
			}
			setActiveQuiz(selectedQuiz);
			navigate(`/quiz/${selectedQuiz.id}`);
		}, [selectedQuiz, setActiveQuiz, navigate]);

		useImperativeHandle(ref, () => ({ open }));

		const content = useMemo(() => {
			if (selectedQuiz) {
				return (
					<Flex gap={16} vertical>
						<Text.Title level={3}>Summary</Text.Title>
						<Flex gap={8} vertical>
							<Text>
								<Text.Span strong>Title:</Text.Span> {selectedQuiz.title}
							</Text>
							<Text>
								<Text.Span strong>Questions count</Text.Span>:{" "}
								{selectedQuiz.questions.length}
							</Text>
							<Text>
								<Text.Span strong>Description:</Text.Span>
								<br />
								{selectedQuiz.description}
							</Text>
						</Flex>
						<Text>
							If the summary matches to the file you selected, click on continue
						</Text>
						<Flex gap={8} justify="flex-end">
							<Button onClick={clearSelectedQuiz}>Select another file</Button>
							<Button color="primary" onClick={handleGenerateQuiz}>
								Continue
							</Button>
						</Flex>
					</Flex>
				);
			}
			return (
				<Flex gap={8} vertical>
					<Text>
						Select a file with the following JSON structure to generate your
						quiz:
					</Text>
					<div className={styles.structureCodeSection}>
						<Code data={baseStructure} noColor />
					</div>
					<Button
						className={styles.selectFileButton}
						color="primary"
						onClick={handleFindFile}
					>
						<Flex align="center" justify="center" gap={8}>
							Select File <BsFiletypeJson />
						</Flex>
					</Button>
					{selectionError && (
						<Text className={styles.selectionError}>{selectionError}</Text>
					)}
					<input
						ref={fileInputRef}
						accept=".json"
						type="file"
						onChange={handleSelectFile}
						hidden
					/>
				</Flex>
			);
		}, [
			fileInputRef,
			handleFindFile,
			selectedQuiz,
			selectionError,
			handleGenerateQuiz,
		]);

		return (
			<dialog ref={dialogRef} className={styles.selectionModal}>
				<div role="heading" aria-level={2}>
					<Flex gap={8} justify="space-between">
						<Text.Title level={2}>Select a file</Text.Title>
						<MdClose className={styles.closeButton} onClick={handleClose} />
					</Flex>
				</div>
				<div>{content}</div>
			</dialog>
		);
	}
);

export type { Handlers as QuizSelectionModalHandlers };
export default QuizSelectionModal;
