import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = resolve(__dirname, "../src");

/** Резолвит @mai/* псевдонимы на исходники пакетов (pnpm workspace). */
function getMaiAliases(): Record<string, string> {
	const aliases: Record<string, string> = {};
	const packagesDir = resolve(srcDir, "packages");

	if (!fs.existsSync(packagesDir)) return aliases;

	for (const pkg of fs.readdirSync(packagesDir)) {
		const entry = resolve(packagesDir, pkg, "src", "index.ts");
		if (fs.existsSync(entry)) {
			aliases[`@mai/${pkg}`] = entry;
		}
	}

	return aliases;
}

const config: StorybookConfig = {
	stories: [
		"../src/**/*.mdx",
		"../src/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)",
		"../src/packages/**/*.mdx",
		"../src/packages/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
		"@storybook/addon-mcp",
	],
	framework: "@storybook/react-vite",
	viteFinal: async (config) => {
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...config.resolve.alias,
			...getMaiAliases(),
			"@": srcDir,
			"virtual:mai-config": resolve(__dirname, "mai-config.ts"),
		};

		return config;
	},
};
export default config;
