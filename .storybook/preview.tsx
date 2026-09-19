import { courseI18NResources } from "@mai/course";
import { initI18n } from "@mai/i18n";
import { sidebarI18NResources } from "@mai/sidebar";
import { ThemeProvider } from "@mai/theme";
import type { Preview } from ".pnpm/@storybook+react-vite@10.6.0_@types+react-dom@19.3.0_@types+react@19.3.0__@types+react@_9a094eedb3c3113d9864ac74301868d5/node_modules/@storybook/react-vite/dist";

/** Инициализация i18next для пакетных компонентов (idempotent). */
initI18n({
  resources: { course: courseI18NResources, sidebar: sidebarI18NResources },
});

const preview: Preview = {
	decorators: [
		(Story) => (
			<ThemeProvider>
				<Story />
			</ThemeProvider>
		),
	],
	parameters: {
		layout: "centered",

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: "todo",
		},
	},
};

export default preview;
