export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	dni: string;
	createdAt: string;
}

export interface Hotel {
	id: string;
	name: string;
	description: string;
	address: string;
	city: string;
	country: string;
	latitude: number;
	longitude: number;
	pricePerNight: number;
	rating: number;
	amenities: string[];
	images: string[];
	roomType: string;
	maxGuests: number;
	available: boolean;
}

export interface Booking {
	id: string;
	userId: string;
	hotelId: string;
	checkIn: string;
	checkOut: string;
	guests: number;
	totalPrice: number;
	status: "pending" | "confirmed" | "cancelled";
	createdAt: string;
	specialRequests?: string;
}

export interface SearchFilters {
	destination: string;
	checkIn: Date | null;
	checkOut: Date | null;
	guests: number;
	minPrice: number;
	maxPrice: number;
	amenities: string[];
	rating: number;
}

export interface Review {
	id: string;
	userId: string;
	hotelId: string;
	userName: string;
	rating: number;
	comment: string;
	createdAt: string;
	verified: boolean;
}

export interface ReviewStats {
	averageRating: number;
	totalReviews: number;
	ratingBreakdown: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

// API Types
export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface LoginResponse {
	user: User;
	token: string;
	refreshToken: string;
}

export interface ErrorResponse {
	message: string;
	code: string;
	details?: any;
}
