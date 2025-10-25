import { create } from "zustand";
import { hotelAPI } from "../services/api";
import { config } from "../config/env";
import type { Hotel, SearchFilters } from "../types";

interface HotelState {
	hotels: Hotel[];
	featuredHotels: Hotel[];
	selectedHotel: Hotel | null;
	searchFilters: SearchFilters;
	loading: boolean;
	error: string | null;

	setHotels: (hotels: Hotel[]) => void;
	setSelectedHotel: (hotel: Hotel | null) => void;
	setSearchFilters: (filters: Partial<SearchFilters>) => void;
	searchHotels: () => Promise<void>;
	getHotelById: (id: string) => Promise<Hotel | null>;
	getFeaturedHotels: () => Promise<void>;
	clearError: () => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
	hotels: [],
	featuredHotels: [],
	selectedHotel: null,
	searchFilters: {
		destination: "",
		checkIn: null,
		checkOut: null,
		guests: 2,
		minPrice: 0,
		maxPrice: 1000,
		amenities: [],
		rating: 0,
	},
	loading: false,
	error: null,

	setHotels: (hotels) => set({ hotels }),
	setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
	setSearchFilters: (filters) =>
		set((state) => ({
			searchFilters: { ...state.searchFilters, ...filters },
		})),

	searchHotels: async () => {
		set({ loading: true, error: null });
		try {
			console.log("Searching hotels with API:", config.apiBaseUrl);
			const filters = get().searchFilters;
			const hotels = await hotelAPI.search(filters);
			set({ hotels, loading: false });
		} catch (error: any) {
			console.error("Search error:", error);
			set({
				error: error.response?.data?.message || "Error al buscar hoteles",
				loading: false,
				hotels: [],
			});
		}
	},

	getHotelById: async (id: string) => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching hotel with API:", config.apiBaseUrl);
			const hotel = await hotelAPI.getById(id);
			set({ selectedHotel: hotel, loading: false });
			return hotel;
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Failed to load hotel",
				loading: false,
			});
			return null;
		}
	},

	getFeaturedHotels: async () => {
		set({ loading: true });
		try {
			console.log("Fetching featured hotels with API:", config.apiBaseUrl);
			const featuredHotels = await hotelAPI.getFeatured();
			set({ featuredHotels, loading: false });
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Failed to load featured hotels",
				loading: false,
			});
		}
	},

	clearError: () => set({ error: null }),
}));
