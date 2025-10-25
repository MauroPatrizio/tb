import { create } from "zustand";
import { bookingAPI } from "../services/api";
import { config } from "../config/env";
import type { Booking } from "../types";

interface BookingState {
	bookings: Booking[];
	currentBooking: Booking | null;
	loading: boolean;
	error: string | null;

	createBooking: (
		bookingData: Omit<Booking, "id" | "createdAt" | "status" | "userId">
	) => Promise<Booking>;
	getUserBookings: () => Promise<Booking[]>;
	cancelBooking: (bookingId: string) => Promise<void>;
	setCurrentBooking: (booking: Booking | null) => void;
	clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
	bookings: [],
	currentBooking: null,
	loading: false,
	error: null,

	createBooking: async (bookingData) => {
		set({ loading: true, error: null });
		try {
			console.log("Creating booking with API:", config.apiBaseUrl);
			let booking: Booking;

			try {
				booking = await bookingAPI.create(bookingData);
			} catch (apiError) {
				console.log("API not available, using mock data");
				booking = {
					id: Math.random().toString(36).substr(2, 9),
					userId: "current-user-id",
					...bookingData,
					status: "confirmed",
					createdAt: new Date().toISOString(),
				};
			}

			set((state) => ({
				bookings: [...state.bookings, booking],
				currentBooking: booking,
				loading: false,
			}));

			return booking;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Failed to create booking";
			set({
				error: errorMessage,
				loading: false,
			});
			throw new Error(errorMessage);
		}
	},

	getUserBookings: async () => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching user bookings with API:", config.apiBaseUrl);
			let userBookings: Booking[];

			try {
				userBookings = await bookingAPI.getByUser();
			} catch (apiError) {
				userBookings = [
					{
						id: "1",
						userId: "current-user-id",
						hotelId: "1",
						checkIn: new Date(Date.now() + 86400000).toISOString(),
						checkOut: new Date(Date.now() + 172800000).toISOString(),
						guests: 2,
						totalPrice: 400,
						status: "confirmed",
						createdAt: new Date().toISOString(),
						specialRequests: "Early check-in please",
					},
				];
			}

			set({ bookings: userBookings, loading: false });
			return userBookings;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Failed to fetch bookings";
			set({
				error: errorMessage,
				loading: false,
			});
			throw new Error(errorMessage);
		}
	},

	cancelBooking: async (bookingId: string) => {
		set({ loading: true, error: null });
		try {
			console.log("Canceling booking with API:", config.apiBaseUrl);
			try {
				await bookingAPI.cancel(bookingId);
			} catch (apiError) {
				console.log("API not available, using mock cancellation");
			}

			set((state) => ({
				bookings: state.bookings.map((booking) =>
					booking.id === bookingId
						? { ...booking, status: "cancelled" as const }
						: booking
				),
				currentBooking:
					state.currentBooking?.id === bookingId
						? { ...state.currentBooking, status: "cancelled" as const }
						: state.currentBooking,
				loading: false,
			}));
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Failed to cancel booking";
			set({
				error: errorMessage,
				loading: false,
			});
			throw new Error(errorMessage);
		}
	},

	setCurrentBooking: (booking) => set({ currentBooking: booking }),
	clearError: () => set({ error: null }),
}));
