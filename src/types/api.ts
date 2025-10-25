import type { User } from ".";

// src/types/api.ts
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
