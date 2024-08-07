import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";
import { UserConfig, defineConfig } from "vite";
import configureTSConfigPaths from "vite-tsconfig-paths";

const DEFAULT_WEB_PORT = 3000;
const ROOT_HTML_FILE = "./index.html";

// https://vitejs.dev/config/
export default defineConfig(() => {
	const dirname = path.dirname(url.fileURLToPath(import.meta.url));
	return {
		plugins: [
			react({
				include: ["src/**/*.tsx", "src/**/*.ts", "src/**/*.scss"],
			}),
			configureTSConfigPaths({
				projects: [path.join(process.cwd(), "tsconfig.json")],
			}),
		],
		root: dirname,
		publicDir: "./public",
		server: {
			open: ROOT_HTML_FILE,
			port: DEFAULT_WEB_PORT,
		},
		build: {
			outDir: path.join(process.cwd(), "build"),
			emptyOutDir: true,
			rollupOptions: {
				input: [path.join(dirname, ROOT_HTML_FILE)],
			},
		},
		preview: {
			port: DEFAULT_WEB_PORT,
		},
	} as UserConfig;
});
