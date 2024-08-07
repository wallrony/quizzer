import classNames from "classnames";
import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "danger" | "success" | "default" | "link" | "ghost";
}

interface LinkButtonProps {
	to: string;
	external?: boolean;
}

const Button = ({
	children,
	color = "default",
	className,
	...rest
}: PropsWithChildren<Props>) => (
	// eslint-disable-next-line react/button-has-type
	<button
		className={classNames(styles.button, className, styles[color])}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...rest}
	>
		{children}
	</button>
);

Button.Link = ({
	to,
	children,
	...rest
}: ComponentPropsWithoutRef<typeof Button> & LinkButtonProps) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<Button color="link" {...rest}>
		<Link to={to}>{children}</Link>
	</Button>
);

export default Button;
