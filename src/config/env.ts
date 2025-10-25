export const config = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
	appName: import.meta.env.VITE_APP_NAME || "BookingApp",
	appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",

	// Validar que las variables requeridas estén presentes
	validate: () => {
		const required = ["VITE_API_BASE_URL"];
		const missing = required.filter((key) => !import.meta.env[key]);

		if (missing.length > 0) {
			console.warn(`Missing environment variables: ${missing.join(", ")}`);
		}
	},
};

// Validar al cargar el módulo
config.validate();
