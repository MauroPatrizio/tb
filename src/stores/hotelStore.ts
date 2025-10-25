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

	// Actions
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
			currentPage: 1, // Reset to first page when filters change
		})),

	searchHotels: async (page = 1) => {
		set({ loading: true, error: null });
		try {
			const filters = get().searchFilters;
			const sortBy = get().sortBy;

			// En una implementación real, estos parámetros irían a la API
			const searchParams = {
				...filters,
				page,
				sortBy,
				limit: 12,
			};

			const hotels = await hotelAPI.search(searchParams);

			// Mock data para la paginación - en realidad esto vendría de la API
			const mockHotels = Array.from({ length: 12 }, (_, index) => ({
				...(hotels[0] || getMockHotel()),
				id: `hotel-${page}-${index}`,
				pricePerNight: Math.floor(Math.random() * 300) + 50,
				rating: Number((Math.random() * 2 + 3).toFixed(1)),
			}));

			set({
				hotels: mockHotels,
				totalResults: 124, // Mock total
				currentPage: page,
				loading: false,
			});
		} catch (error: any) {
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
				error: error.response?.data?.message || "Failed to load hotel",
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
				error: error.response?.data?.message || "Failed to load featured hotels",
				loading: false,
			});
		}
	},

	clearError: () => set({ error: null }),
	setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
	setPage: (page) => set({ currentPage: page }),
}));

// Helper function for mock data
function getMockHotel(): Hotel {
	return {
		id: "1",
		name: "Hotel Ejemplo",
		description: "Un hotel de ejemplo",
		address: "123 Calle Principal",
		city: "Ciudad Ejemplo",
		country: "País Ejemplo",
		latitude: 0,
		longitude: 0,
		pricePerNight: 100,
		rating: 4.5,
		amenities: ["wifi", "pool"],
		images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
		roomType: "Standard",
		maxGuests: 2,
		available: true,
	};
}
