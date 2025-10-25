import { create } from "zustand";
import { hotelAPI } from "../services/api";
import type { Hotel, SearchFilters } from "../types";

interface HotelState {
	hotels: Hotel[];
	featuredHotels: Hotel[];
	selectedHotel: Hotel | null;
	searchFilters: SearchFilters;
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	sortBy: string;

	setHotels: (hotels: Hotel[]) => void;
	setSelectedHotel: (hotel: Hotel | null) => void;
	setSearchFilters: (filters: Partial<SearchFilters>) => void;
	searchHotels: (page?: number) => Promise<void>;
	getHotelById: (id: string) => Promise<Hotel | null>;
	getFeaturedHotels: () => Promise<void>;
	clearError: () => void;
	setSortBy: (sort: string) => void;
	setPage: (page: number) => void;
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
	totalResults: 0,
	currentPage: 1,
	sortBy: "recommended",

	setHotels: (hotels) => set({ hotels }),
	setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
	setSearchFilters: (filters) =>
		set((state) => ({
			searchFilters: { ...state.searchFilters, ...filters },
			currentPage: 1,
		})),

	searchHotels: async (page = 1) => {
		set({ loading: true, error: null });
		try {
			const filters = get().searchFilters;
			console.log("Buscando hoteles con filtros:", filters);

			const hotels = await hotelAPI.search(filters);
			console.log("Hoteles encontrados:", hotels);

			set({
				hotels,
				totalResults: hotels.length, // Tu backend debería devolver esto
				currentPage: page,
				loading: false,
			});
		} catch (error: any) {
			console.error("Error en búsqueda:", error);
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
			const hotel = await hotelAPI.getById(id);
			set({ selectedHotel: hotel, loading: false });
			return hotel;
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Error al cargar hotel",
				loading: false,
			});
			return null;
		}
	},

	getFeaturedHotels: async () => {
		set({ loading: true });
		try {
			const featuredHotels = await hotelAPI.getFeatured();
			set({ featuredHotels, loading: false });
		} catch (error: any) {
			set({
				error: error.response?.data?.message || "Error al cargar hoteles destacados",
				loading: false,
			});
		}
	},

	clearError: () => set({ error: null }),
	setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
	setPage: (page) => set({ currentPage: page }),
}));
