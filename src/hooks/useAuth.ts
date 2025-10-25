// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
	const { isAuthenticated, user, loading, loadUserProfile } = useAuthStore();

	useEffect(() => {
		if (isAuthenticated && !user) {
			loadUserProfile();
		}
	}, [isAuthenticated, user, loadUserProfile]);

	return {
		isAuthenticated,
		user,
		loading,
	};
};
