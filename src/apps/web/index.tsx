import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

const Root = () => (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

ReactDOM.createRoot(document.querySelector("#root")!).render(<Root />);
