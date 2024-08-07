import { useState } from "react";

// A hook for handling transitions
export const useDuration = () => {
	const [executing, setExecuting] = useState(false);

	const run = (callback: () => void, duration: number) => {
		setExecuting(true);
		setTimeout(() => {
			setExecuting(false);
			callback();
		}, duration);
	};

	return {
		executing,
		run,
	};
};
