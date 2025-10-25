import { create } from "zustand";
import { authAPI, userAPI } from "../services/api";
import { config } from "../config/env";
import type { User } from "../types";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;

	login: (email: string, password: string) => Promise<void>;
	register: (userData: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<void>;
	logout: () => void;
	setAuth: (user: User, token: string) => void;
	clearError: () => void;
	loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: localStorage.getItem("token"),
	isAuthenticated: !!localStorage.getItem("token"),
	loading: false,
	error: null,

	login: async (email: string, password: string) => {
		set({ loading: true, error: null });
		try {
			console.log("Logging in with API:", config.apiBaseUrl);
			const { user, token } = await authAPI.login(email, password);
			localStorage.setItem("token", token);
			set({ user, token, isAuthenticated: true, loading: false });
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Login failed",
				loading: false,
			});
			throw error;
		}
	},

	register: async (userData) => {
		set({ loading: true, error: null });
		try {
			console.log("Registering with API:", config.apiBaseUrl);
			const { user, token } = await authAPI.register(userData);
			localStorage.setItem("token", token);
			set({ user, token, isAuthenticated: true, loading: false });
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Registration failed",
				loading: false,
			});
			throw error;
		}
	},

	logout: () => {
		localStorage.removeItem("token");
		set({ user: null, token: null, isAuthenticated: false });
	},

	setAuth: (user: User, token: string) => {
		localStorage.setItem("token", token);
		set({ user, token, isAuthenticated: true });
	},

	clearError: () => set({ error: null }),

	loadUserProfile: async () => {
		set({ loading: true });
		try {
			const user = await userAPI.getProfile();
			set({ user, loading: false });
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Failed to load profile",
				loading: false,
			});
			throw error;
		}
	},
}));
