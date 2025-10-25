import { useThemeStore } from "../stores/themeStore";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export const ThemeToggle: React.FC = () => {
	const { isDarkMode, toggleTheme } = useThemeStore();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
			aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
		>
			{isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
		</button>
	);
};
