import { useContext } from "react";

import styles from "./styles.module.scss";
import { NavigationCTX } from "../../lib/contexts/navigation/context";
import Button from "../button";

const HeaderNavigator = () => {
	const { activePage, routes } = useContext(NavigationCTX);

	return (
		<nav className={styles.headerNavigator}>
			{routes
				.filter((page) => !page.hidden)
				.map((page) => {
					const pageIsActive = activePage?.path === page.path;
					return (
						<Button.Link
							key={page.path}
							to={page.path}
							color={pageIsActive ? "primary" : "link"}
							className={pageIsActive ? styles.active : undefined}
						>
							{page.title}
						</Button.Link>
					);
				})}
		</nav>
	);
};

export default HeaderNavigator;
