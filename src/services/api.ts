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

// 🔐 AUTH ENDPOINTS
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

// 🏨 HOTEL ENDPOINTS
export const hotelAPI = {
	// Búsqueda de hoteles con filtros
	search: async (filters: SearchFilters): Promise<Hotel[]> => {
		const params: any = {};

		if (filters.destination) params.destination = filters.destination;
		if (filters.checkIn) params.checkIn = filters.checkIn.toISOString().split("T")[0];
		if (filters.checkOut) params.checkOut = filters.checkOut.toISOString().split("T")[0];
		if (filters.guests) params.guests = filters.guests;
		if (filters.minPrice) params.minPrice = filters.minPrice;
		if (filters.maxPrice) params.maxPrice = filters.maxPrice;
		if (filters.rating) params.minRating = filters.rating;
		if (filters.amenities.length > 0) params.amenities = filters.amenities.join(",");

		const response = await api.get("/hotels", { params });
		return response.data;
	},

	// Detalle de hotel por ID
	getById: async (id: string): Promise<Hotel> => {
		const response = await api.get(`/hotels/${id}`);
		return response.data;
	},

	// Hoteles destacados
	getFeatured: async (): Promise<Hotel[]> => {
		const response = await api.get("/hotels/featured");
		return response.data;
	},

	// Hoteles por ciudad
	getByCity: async (city: string): Promise<Hotel[]> => {
		const response = await api.get(`/hotels/city/${city}`);
		return response.data;
	},
};

// 📅 BOOKING ENDPOINTS
export const bookingAPI = {
	// Crear reserva
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

	// Reservas del usuario actual
	getByUser: async (): Promise<Booking[]> => {
		const response = await api.get("/bookings/my-bookings");
		return response.data;
	},

	// Detalle de reserva
	getById: async (bookingId: string): Promise<Booking> => {
		const response = await api.get(`/bookings/${bookingId}`);
		return response.data;
	},

	// Cancelar reserva
	cancel: async (bookingId: string): Promise<Booking> => {
		const response = await api.patch(`/bookings/${bookingId}/cancel`);
		return response.data;
	},

	// Actualizar reserva
	update: async (bookingId: string, updates: Partial<Booking>): Promise<Booking> => {
		const response = await api.patch(`/bookings/${bookingId}`, updates);
		return response.data;
	},
};

// ⭐ REVIEW ENDPOINTS
export const reviewAPI = {
	// Reviews de un hotel
	getByHotel: async (hotelId: string): Promise<Review[]> => {
		const response = await api.get(`/reviews/hotel/${hotelId}`);
		return response.data;
	},

	// Estadísticas de reviews
	getStats: async (hotelId: string) => {
		const response = await api.get(`/reviews/hotel/${hotelId}/stats`);
		return response.data;
	},

	// Crear review
	create: async (reviewData: {
		hotelId: string;
		rating: number;
		comment: string;
	}): Promise<Review> => {
		const response = await api.post("/reviews", reviewData);
		return response.data;
	},

	// Actualizar review
	update: async (reviewId: string, updates: Partial<Review>): Promise<Review> => {
		const response = await api.patch(`/reviews/${reviewId}`, updates);
		return response.data;
	},

	// Eliminar review
	delete: async (reviewId: string): Promise<void> => {
		await api.delete(`/reviews/${reviewId}`);
	},
};

// 👤 USER ENDPOINTS
export const userAPI = {
	// Perfil del usuario
	getProfile: async (): Promise<User> => {
		const response = await api.get("/users/profile");
		return response.data;
	},

	// Actualizar perfil
	updateProfile: async (updates: Partial<User>): Promise<User> => {
		const response = await api.patch("/users/profile", updates);
		return response.data;
	},

	// Cambiar contraseña
	changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
		await api.patch("/users/password", { currentPassword, newPassword });
	},
};

// ❤️ FAVORITE ENDPOINTS
export const favoriteAPI = {
	// Listar favoritos
	getFavorites: async (): Promise<Hotel[]> => {
		const response = await api.get("/favorites");
		return response.data;
	},

	// Agregar a favoritos
	addFavorite: async (hotelId: string): Promise<void> => {
		await api.post("/favorites", { hotelId });
	},

	// Quitar de favoritos
	removeFavorite: async (hotelId: string): Promise<void> => {
		await api.delete(`/favorites/${hotelId}`);
	},

	// Verificar si es favorito
	isFavorite: async (hotelId: string): Promise<boolean> => {
		const response = await api.get(`/favorites/${hotelId}/check`);
		return response.data.isFavorite;
	},
};

export default api;
