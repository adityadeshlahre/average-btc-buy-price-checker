import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { resolve } from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
	],
	base: "/",
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	preview: {
		host: "0.0.0.0",
		port: 3000,
		strictPort: true,
		cors: true,
		allowedHosts: true,
	},
	server: {
		host: true,
		port: 3000,
		strictPort: true,
		cors: true,
		allowedHosts: true,
	},
	build: {
		outDir: "dist",
	},
});
