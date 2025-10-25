import { useThemeStore } from "../stores/themeStore";

export const ThemeDebug: React.FC = () => {
	const { isDarkMode } = useThemeStore();

	return (
		<div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
			Theme: {isDarkMode ? "Dark" : "Light"}
		</div>
	);
};
