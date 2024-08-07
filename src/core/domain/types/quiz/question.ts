export const QUESTION_TYPE_VALUES = {
	MultipleChoice: "multiple_choice",
	SingleChoice: "single_choice",
	CustomAnswer: "custom_answer",
} as const;

export type QuestionType =
	(typeof QUESTION_TYPE_VALUES)[keyof typeof QUESTION_TYPE_VALUES];

type QuestionAnswerType = number | number[] | null;

export interface QuestionJumpAction {
	answer: QuestionAnswerType;
	// Question identifier or index
	question: string | number;
}

export interface QuestionAction {
	jumpTo?: QuestionJumpAction;
}

interface BaseQuestion {
	id: string;
	title: string;
	image?: string;
	description?: string;
	options: string[] | null;
	type: QuestionType;
	correctAnswer: QuestionAnswerType;
	actions?: QuestionAction;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
	options: string[];
	type: typeof QUESTION_TYPE_VALUES.MultipleChoice;
	// Array of indexes of the correct options
	correctAnswer: number[];
}

export interface SingleChoiceQuestion extends BaseQuestion {
	options: string[];
	type: typeof QUESTION_TYPE_VALUES.SingleChoice;
	correctAnswer: number;
}

export interface CustomAnswerQuestion extends BaseQuestion {
	options: null;
	type: typeof QUESTION_TYPE_VALUES.CustomAnswer;
	correctAnswer: null;
}

export type Question =
	| MultipleChoiceQuestion
	| SingleChoiceQuestion
	| CustomAnswerQuestion;

export type DraftQuestion = Omit<Question, "id"> & { id?: string };
