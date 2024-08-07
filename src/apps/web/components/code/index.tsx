import classNames from "classnames";
import { useMemo } from "react";

import styles from "./styles.module.scss";

interface Props<T> {
	children?: React.ReactNode;
	data?: T;
	compact?: boolean;
	noColor?: boolean;
}

const Code = <T extends object = Record<string, unknown>>({
	children,
	data,
	compact,
	noColor,
}: Props<T>) => {
	const content = useMemo(() => {
		if (children) {
			return children;
		}
		if (!data) {
			return null;
		}
		const formattedData = JSON.stringify(data, undefined, 2);
		if (compact) {
			return formattedData;
		}
		return <pre>{formattedData}</pre>;
	}, [compact, data, children]);

	return (
		<code
			className={classNames(styles.code, {
				[styles.compact]: compact,
				[styles.noColor]: noColor,
			})}
		>
			{content}
		</code>
	);
};

export default Code;
