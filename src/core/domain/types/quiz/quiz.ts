import { DraftQuestion, Question } from "./question";

export interface Quiz {
	// Quiz identifier - if not provided, it will be generated.
	// It's used to identify its answers and which quizzes were already generated.
	id: string;
	title: string;
	image?: string;
	description: string;
	questions: Question[];
}

export type DraftQuiz = Omit<Quiz, "id" | "questions"> & {
	id?: string;
	questions: DraftQuestion[];
};
