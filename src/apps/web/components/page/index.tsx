import classNames from "classnames";
import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
}

const Page = ({ children, className }: PropsWithChildren<Props>) => (
	<main className={classNames(styles.page, className)}>{children}</main>
);

export default Page;
