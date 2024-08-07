import classNames from "classnames";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	children?: React.ReactNode;
	onClick?: () => void;
}

const Card = ({ className, children, onClick }: Props) => (
	<div
		className={classNames(
			styles.card,
			{
				[styles.clickable]: !!onClick,
			},
			className
		)}
		onClick={onClick}
		onKeyDown={onClick}
		role="button"
		tabIndex={0}
	>
		{children}
	</div>
);

export default Card;
