import classNames from "classnames";
import { CSSProperties, PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	gap?: CSSProperties["gap"];
	vertical?: boolean;
	align?: CSSProperties["alignItems"];
	justify?: CSSProperties["justifyContent"];
}

const Flex = ({
	children,
	className,
	gap,
	vertical,
	align,
	justify,
}: PropsWithChildren<Props>) => {
	const inlineStyle: CSSProperties = {
		gap,
		flexDirection: vertical ? "column" : "row",
		alignItems: align,
		justifyContent: justify,
	};

	return (
		<div className={classNames(styles.flex, className)} style={inlineStyle}>
			{children}
		</div>
	);
};

export default Flex;
