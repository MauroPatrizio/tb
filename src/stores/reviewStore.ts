// src/stores/reviewStore.ts
import { create } from "zustand";
import type { Review, ReviewStats } from "../types";

interface ReviewState {
	reviews: Review[];
	reviewStats: ReviewStats | null;
	loading: boolean;

	// Actions
	getHotelReviews: (hotelId: string) => Promise<Review[]>;
	getReviewStats: (hotelId: string) => Promise<ReviewStats>;
	addReview: (review: Omit<Review, "id" | "createdAt" | "verified">) => Promise<Review>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
	reviews: [],
	reviewStats: null,
	loading: false,

	getHotelReviews: async (hotelId: string) => {
		set({ loading: true });
		try {
			// Mock data - reemplazar con llamada real a tu API
			const mockReviews: Review[] = [
				{
					id: "1",
					userId: "user1",
					hotelId,
					userName: "John Doe",
					rating: 5,
					comment: "Amazing hotel with great service and beautiful views!",
					createdAt: new Date().toISOString(),
					verified: true,
				},
				{
					id: "2",
					userId: "user2",
					hotelId,
					userName: "Jane Smith",
					rating: 4,
					comment: "Very good location and comfortable rooms.",
					createdAt: new Date(Date.now() - 86400000).toISOString(),
					verified: true,
				},
			];

			set({ reviews: mockReviews, loading: false });
			return mockReviews;
		} catch (error) {
			set({ loading: false });
			throw error;
		}
	},

	getReviewStats: async (hotelId: string) => {
		try {
			// Mock data
			const stats: ReviewStats = {
				averageRating: 4.5,
				totalReviews: 127,
				ratingBreakdown: {
					5: 80,
					4: 35,
					3: 8,
					2: 3,
					1: 1,
				},
			};

			set({ reviewStats: stats });
			return stats;
		} catch (error) {
			throw error;
		}
	},

	addReview: async (reviewData) => {
		set({ loading: true });
		try {
			const newReview: Review = {
				id: Math.random().toString(36).substr(2, 9),
				...reviewData,
				createdAt: new Date().toISOString(),
				verified: false,
			};

			set((state) => ({
				reviews: [newReview, ...state.reviews],
				loading: false,
			}));

			return newReview;
		} catch (error) {
			set({ loading: false });
			throw error;
		}
	},
}));
