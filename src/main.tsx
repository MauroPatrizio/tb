import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { config } from "./config/env";

console.log("App started with config:", {
	appName: config.appName,
	apiBaseUrl: config.apiBaseUrl,
	version: config.appVersion,
});

// Inicializar tema desde localStorage
const initializeTheme = () => {
	const savedTheme = localStorage.getItem("theme-storage");
	if (savedTheme) {
		try {
			const themeState = JSON.parse(savedTheme);
			if (themeState.state.isDarkMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		} catch (error) {
			console.log("Error loading theme from localStorage");
		}
	}
};

initializeTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
