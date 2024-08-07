export interface QuestionAnswer {
	questionId: string;
	answer: string | number | number[];
}

export interface Answer {
	quizId: string;
	answers: QuestionAnswer[];
}
