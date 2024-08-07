export interface Route {
	title: string;
	path: string;
	page: React.ReactNode;
	hidden?: boolean;
}
