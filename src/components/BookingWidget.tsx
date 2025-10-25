import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useBookingStore } from "../stores/bookingStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Hotel } from "../types";

interface BookingWidgetProps {
	hotel: Hotel;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ hotel }) => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuthStore();
	const { createBooking, loading } = useBookingStore();
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [guests, setGuests] = useState(2);
	const [specialRequests, setSpecialRequests] = useState("");

	const calculateTotal = () => {
		if (!checkIn || !checkOut) return hotel.pricePerNight;

		const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
		return hotel.pricePerNight * nights;
	};

	const calculateServiceFee = () => {
		return calculateTotal() * 0.1;
	};

	const calculateFinalTotal = () => {
		return calculateTotal() + calculateServiceFee();
	};

	const handleBookNow = async () => {
		if (!isAuthenticated || !user) {
			navigate("/login");
			return;
		}

		if (!checkIn || !checkOut) {
			alert("Please select check-in and check-out dates");
			return;
		}

		if (checkIn >= checkOut) {
			alert("Check-out date must be after check-in date");
			return;
		}

		try {
			const bookingData = {
				hotelId: hotel.id,
				checkIn: checkIn.toISOString(),
				checkOut: checkOut.toISOString(),
				guests,
				totalPrice: calculateTotal(),
				...(specialRequests && { specialRequests }),
			};

			const booking = await createBooking(bookingData);
			navigate(`/booking-confirmation/${booking.id}`);
		} catch (error: any) {
			alert(error.message || "Failed to create booking");
		}
	};

	const isDateDisabled = (date: Date) => {
		return date < new Date();
	};

	const nights =
		checkIn && checkOut
			? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
			: 0;

	return (
		<div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
			<div className="mb-4">
				<div className="flex justify-between items-start mb-2">
					<span className="text-2xl font-bold text-gray-900">${hotel.pricePerNight}</span>
					<span className="text-gray-600 text-sm">per night</span>
				</div>
				<div className="flex items-center text-sm text-gray-600">
					<span className="text-yellow-400 mr-1">★</span>
					<span>
						{hotel.rating} • {Math.floor(Math.random() * 100) + 50} Reviews
					</span>
				</div>
			</div>

			{/* Date Pickers */}
			<div className="space-y-4 mb-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
					<DatePicker
						selected={checkIn}
						onChange={setCheckIn}
						selectsStart
						startDate={checkIn}
						endDate={checkOut}
						minDate={new Date()}
						filterDate={isDateDisabled}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholderText="Add dates"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Check-out
					</label>
					<DatePicker
						selected={checkOut}
						onChange={setCheckOut}
						selectsEnd
						startDate={checkIn}
						endDate={checkOut}
						minDate={checkIn || new Date()}
						filterDate={isDateDisabled}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholderText="Add dates"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
					<select
						value={guests}
						onChange={(e) => setGuests(parseInt(e.target.value))}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					>
						{[1, 2, 3, 4, 5, 6].map((num) => (
							<option
								key={num}
								value={num}
							>
								{num} {num === 1 ? "Guest" : "Guests"}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Special Requests (Optional)
					</label>
					<textarea
						value={specialRequests}
						onChange={(e) => setSpecialRequests(e.target.value)}
						rows={3}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholder="Any special requirements..."
					/>
				</div>
			</div>

			{/* Price Breakdown */}
			{checkIn && checkOut && (
				<div className="border-t border-gray-200 pt-4 mb-4">
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span>
								${hotel.pricePerNight} × {nights} nights
							</span>
							<span>${calculateTotal().toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-gray-600">
							<span>Service fee</span>
							<span>${calculateServiceFee().toFixed(2)}</span>
						</div>
						<div className="flex justify-between font-semibold text-lg border-t pt-2">
							<span>Total</span>
							<span>${calculateFinalTotal().toFixed(2)}</span>
						</div>
					</div>
				</div>
			)}

			<button
				onClick={handleBookNow}
				disabled={loading || !checkIn || !checkOut}
				className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? "Processing..." : isAuthenticated ? "Reserve Now" : "Sign in to Book"}
			</button>

			<p className="text-xs text-gray-500 text-center mt-3">You won't be charged yet</p>
		</div>
	);
};
