import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { config } from "../config/env";
import type { Booking, Hotel, Review, SearchFilters, User } from "../types";

const api = axios.create({
	baseURL: config.apiBaseUrl,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 15000,
});

// Interceptor para requests
api.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para responses
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout();
			if (!window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
		}

		if (error.code === "NETWORK_ERROR" || error.code === "ECONNABORTED") {
			console.error("Network error:", error.message);
		}

		return Promise.reject(error);
	}
);

export const authAPI = {
	login: async (email: string, password: string) => {
		const response = await api.post("/auth/login", { email, password });
		return response.data;
	},

	register: async (userData: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		dni: string;
		password: string;
	}) => {
		const response = await api.post("/auth/register", userData);
		return response.data;
	},

	googleLogin: async (token: string) => {
		const response = await api.post("/auth/google", { token });
		return response.data;
	},

	refreshToken: async () => {
		const response = await api.post("/auth/refresh");
		return response.data;
	},
};

export const hotelAPI = {
	search: async (filters: SearchFilters): Promise<Hotel[]> => {
		const params = new URLSearchParams();

		if (filters.destination) params.append("destination", filters.destination);
		if (filters.checkIn) params.append("checkIn", filters.checkIn.toISOString());
		if (filters.checkOut) params.append("checkOut", filters.checkOut.toISOString());
		if (filters.guests) params.append("guests", filters.guests.toString());
		if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
		if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
		if (filters.rating) params.append("minRating", filters.rating.toString());
		filters.amenities.forEach((amenity) => params.append("amenities", amenity));

		const response = await api.get(`/hotels/search?${params}`);
		return response.data;
	},

	getById: async (id: string): Promise<Hotel> => {
		const response = await api.get(`/hotels/${id}`);
		return response.data;
	},

	getFeatured: async (): Promise<Hotel[]> => {
		const response = await api.get("/hotels/featured");
		return response.data;
	},

	getByCity: async (city: string): Promise<Hotel[]> => {
		const response = await api.get(`/hotels/city/${city}`);
		return response.data;
	},
};

export const bookingAPI = {
	create: async (bookingData: {
		hotelId: string;
		checkIn: string;
		checkOut: string;
		guests: number;
		totalPrice: number;
		specialRequests?: string;
	}): Promise<Booking> => {
		const response = await api.post("/bookings", bookingData);
		return response.data;
	},

	getByUser: async (): Promise<Booking[]> => {
		const response = await api.get("/bookings/my-bookings");
		return response.data;
	},

	getById: async (bookingId: string): Promise<Booking> => {
		const response = await api.get(`/bookings/${bookingId}`);
		return response.data;
	},

	cancel: async (bookingId: string): Promise<Booking> => {
		const response = await api.patch(`/bookings/${bookingId}/cancel`);
		return response.data;
	},

	update: async (bookingId: string, updates: Partial<Booking>): Promise<Booking> => {
		const response = await api.patch(`/bookings/${bookingId}`, updates);
		return response.data;
	},
};

export const reviewAPI = {
	getByHotel: async (hotelId: string): Promise<Review[]> => {
		const response = await api.get(`/reviews/hotel/${hotelId}`);
		return response.data;
	},

	getStats: async (hotelId: string) => {
		const response = await api.get(`/reviews/hotel/${hotelId}/stats`);
		return response.data;
	},

	create: async (reviewData: {
		hotelId: string;
		rating: number;
		comment: string;
	}): Promise<Review> => {
		const response = await api.post("/reviews", reviewData);
		return response.data;
	},

	update: async (reviewId: string, updates: Partial<Review>): Promise<Review> => {
		const response = await api.patch(`/reviews/${reviewId}`, updates);
		return response.data;
	},

	delete: async (reviewId: string): Promise<void> => {
		await api.delete(`/reviews/${reviewId}`);
	},
};

export const userAPI = {
	getProfile: async (): Promise<User> => {
		const response = await api.get("/users/profile");
		return response.data;
	},

	updateProfile: async (updates: Partial<User>): Promise<User> => {
		const response = await api.patch("/users/profile", updates);
		return response.data;
	},

	changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
		await api.patch("/users/password", { currentPassword, newPassword });
	},
};

export const favoriteAPI = {
	getFavorites: async (): Promise<Hotel[]> => {
		const response = await api.get("/favorites");
		return response.data;
	},

	addFavorite: async (hotelId: string): Promise<void> => {
		await api.post("/favorites", { hotelId });
	},

	removeFavorite: async (hotelId: string): Promise<void> => {
		await api.delete(`/favorites/${hotelId}`);
	},

	isFavorite: async (hotelId: string): Promise<boolean> => {
		const response = await api.get(`/favorites/${hotelId}/check`);
		return response.data.isFavorite;
	},
};

export default api;
