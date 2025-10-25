import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
	isDarkMode: boolean;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			isDarkMode: false,

			toggleTheme: () => {
				const newTheme = !get().isDarkMode;
				set({ isDarkMode: newTheme });
			},
		}),
		{
			name: "theme-storage",
		}
	)
);
