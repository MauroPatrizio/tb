import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useThemeStore } from "../stores/themeStore";
import { useEffect } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { isDarkMode } = useThemeStore();

	useEffect(() => {
		// Aplicar/remover la clase 'dark' en el html element
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
			<Navigation />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
};
