import classNames from "classnames";
import { compact } from "lodash";
import { createRef, useCallback, useMemo } from "react";

import { QuestionAnswer } from "@core/domain/types/quiz/answer";
import { QuestionType } from "@core/domain/types/quiz/question";

import Flex from "@web/components/flex";

import Text from "@web/components/text";

import styles from "./styles.module.scss";

interface Props {
	id: string;
	type: QuestionType;
	options: string[] | null;
	answer: QuestionAnswer["answer"] | null;
	onAnswer: (result: QuestionAnswer["answer"]) => void;
}

const QuestionInput = ({ type, id, options, answer, onAnswer }: Props) => {
	const formRef = createRef<HTMLFormElement>();

	const handleSubmit = useCallback((event: React.FormEvent) => {
		event.preventDefault();
	}, []);

	const handleAnswer = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			if (type === "multiple_choice") {
				const inputs =
					formRef.current?.querySelectorAll<HTMLInputElement>("input") ?? [];
				const values = compact(
					[...inputs].map((input) =>
						input.checked ? String(input.value) : null
					)
				);
				onAnswer(values.map(Number));
			} else if (type === "single_choice") {
				onAnswer(Number(value));
			} else {
				onAnswer(value);
			}
		},
		[onAnswer, type, formRef]
	);

	const content = useMemo(() => {
		if (type === "multiple_choice" || type === "single_choice") {
			return (
				<Flex gap={16} vertical>
					<Text>
						{type === "multiple_choice"
							? "You can choose more than one option"
							: "You can just choose one option"}
					</Text>
					<Flex gap={8} vertical>
						{options?.map((option, optIdx) => {
							const inputId = `option-${id}-${optIdx}`;
							const answerList = (answer ?? []) as number[];
							const checked =
								type === "multiple_choice"
									? answerList?.includes(optIdx)
									: answer === optIdx;
							return (
								<div key={inputId}>
									<label
										className={classNames({
											[styles.active]: checked,
											[styles.checkboxOption]: type === "multiple_choice",
											[styles.radioOption]: type === "single_choice",
										})}
										htmlFor={inputId}
										title={option}
									>
										<input
											type={type === "multiple_choice" ? "checkbox" : "radio"}
											id={inputId}
											name={`question-${id}-answer`}
											value={optIdx}
											onChange={handleAnswer}
											checked={checked}
											hidden
										/>
										{option}
									</label>
								</div>
							);
						})}
					</Flex>
				</Flex>
			);
		}
		return (
			<label className={styles.notInline} htmlFor={`${id}-answer`}>
				Answer{" "}
				<input
					className={styles.customInput}
					id={`${id}-answer`}
					name={`${id}-answer`}
					onChange={handleAnswer}
					value={answer ? String(answer) : undefined}
				/>
			</label>
		);
	}, [handleAnswer, options, type, id, answer]);

	return (
		<form
			ref={formRef}
			className={styles.form}
			action="#!"
			onSubmit={handleSubmit}
		>
			{content}
		</form>
	);
};

export default QuestionInput;
