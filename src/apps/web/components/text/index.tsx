import classNames from "classnames";
import { PropsWithChildren, createElement } from "react";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	strong?: boolean;
}

interface TitleProps extends Pick<Props, "className"> {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Text = ({ children, className, strong }: PropsWithChildren<Props>) => {
	const cls = classNames(styles.text, className);
	if (strong) {
		return <strong className={cls}>{children}</strong>;
	}
	return <p className={classNames(styles.text, className)}>{children}</p>;
};

Text.Title = ({
	children,
	className,
	level = 2,
}: PropsWithChildren<TitleProps>) =>
	createElement(
		`h${level}`,
		{ className: classNames(styles.title, className) },
		children
	);

Text.Span = ({ children, className, strong }: PropsWithChildren<Props>) => (
	<span className={classNames(styles.textSpan, className)}>
		{strong ? <strong>{children}</strong> : children}
	</span>
);

export default Text;
