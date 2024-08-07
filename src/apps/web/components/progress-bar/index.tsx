import classNames from "classnames";

import styles from "./styles.module.scss";

interface Props {
	progress: number;
	max: number;
}

const ProgressBar = ({ progress, max }: Props) => (
	<div className={styles.progressBar}>
		<div
			className={classNames(styles.progressBarInner, {
				[styles.filled]: progress === max,
			})}
			style={{ width: `${(progress / max) * 100}%` }}
		/>
	</div>
);

export default ProgressBar;
