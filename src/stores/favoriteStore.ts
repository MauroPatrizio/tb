// src/stores/favoriteStore.ts
import { create } from "zustand";
import type { Hotel } from "../types";

interface FavoriteState {
	favorites: Hotel[];
	loading: boolean;

	// Actions
	addFavorite: (hotel: Hotel) => void;
	removeFavorite: (hotelId: string) => void;
	isFavorite: (hotelId: string) => boolean;
	getFavorites: () => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
	favorites: [],
	loading: false,

	addFavorite: (hotel) => {
		set((state) => {
			if (state.favorites.find((fav) => fav.id === hotel.id)) {
				return state; // Already in favorites
			}
			return { favorites: [...state.favorites, hotel] };
		});

		// En una implementación real, haríamos una llamada a la API aquí
		localStorage.setItem("favorites", JSON.stringify(get().favorites));
	},

	removeFavorite: (hotelId) => {
		set((state) => ({
			favorites: state.favorites.filter((fav) => fav.id !== hotelId),
		}));

		// En una implementación real, haríamos una llamada a la API aquí
		localStorage.setItem("favorites", JSON.stringify(get().favorites));
	},

	isFavorite: (hotelId) => {
		return get().favorites.some((fav) => fav.id === hotelId);
	},

	getFavorites: async () => {
		set({ loading: true });
		try {
			// Mock - en realidad esto vendría de tu API
			const stored = localStorage.getItem("favorites");
			if (stored) {
				set({ favorites: JSON.parse(stored) });
			}
		} finally {
			set({ loading: false });
		}
	},
}));
