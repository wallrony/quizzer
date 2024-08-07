import classNames from "classnames";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
}

const Divider = ({ className }: Props) => (
	<hr className={classNames(styles.divider, className)} />
);

export default Divider;
