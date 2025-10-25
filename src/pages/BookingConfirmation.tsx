import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBookingStore } from "../stores/bookingStore";
import { useHotelStore } from "../stores/hotelStore";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export const BookingConfirmation: React.FC = () => {
	const { bookingId } = useParams<{ bookingId: string }>();
	const navigate = useNavigate();
	const { currentBooking, getUserBookings } = useBookingStore();
	const { selectedHotel } = useHotelStore();

	useEffect(() => {
		if (!currentBooking && bookingId) {
			// No necesita pasar userId, se obtiene del token
			getUserBookings();
		}
	}, [bookingId, currentBooking, getUserBookings]);

	if (!currentBooking) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
					<Link
						to="/"
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
					>
						Back to Home
					</Link>
				</div>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					{/* Success Header */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
						<CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Booking Confirmed!
						</h1>
						<p className="text-gray-600">
							Your reservation has been successfully completed. We've sent a
							confirmation to your email.
						</p>
					</div>

					{/* Booking Details */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">Booking Details</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium text-gray-900">Confirmation Number</h3>
								<p className="text-gray-600 font-mono">{currentBooking.id}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-900">Status</h3>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										currentBooking.status === "confirmed"
											? "bg-green-100 text-green-800"
											: currentBooking.status === "pending"
											? "bg-yellow-100 text-yellow-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{currentBooking.status.charAt(0).toUpperCase() +
										currentBooking.status.slice(1)}
								</span>
							</div>
							<div>
								<h3 className="font-medium text-gray-900">Check-in</h3>
								<p className="text-gray-600">
									{formatDate(currentBooking.checkIn)}
								</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-900">Check-out</h3>
								<p className="text-gray-600">
									{formatDate(currentBooking.checkOut)}
								</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-900">Guests</h3>
								<p className="text-gray-600">{currentBooking.guests} guests</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-900">Total Price</h3>
								<p className="text-gray-600">${currentBooking.totalPrice}</p>
							</div>
							{currentBooking.specialRequests && (
								<div className="md:col-span-2">
									<h3 className="font-medium text-gray-900">Special Requests</h3>
									<p className="text-gray-600">
										{currentBooking.specialRequests}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Hotel Information */}
					{selectedHotel && (
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h2 className="text-xl font-semibold mb-4">Hotel Information</h2>
							<div className="flex items-start space-x-4">
								<img
									src={selectedHotel.images[0]}
									alt={selectedHotel.name}
									className="w-20 h-20 object-cover rounded-lg"
								/>
								<div>
									<h3 className="font-semibold text-gray-900">
										{selectedHotel.name}
									</h3>
									<p className="text-gray-600 text-sm">{selectedHotel.address}</p>
									<p className="text-gray-600 text-sm">
										{selectedHotel.city}, {selectedHotel.country}
									</p>
									<div className="flex items-center mt-1">
										<span className="text-yellow-400 mr-1">★</span>
										<span className="text-sm text-gray-600">
											{selectedHotel.rating}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Next Steps */}
					<div className="bg-blue-50 rounded-lg p-6 mb-6">
						<h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
						<ul className="text-blue-800 text-sm space-y-1">
							<li>• You'll receive a confirmation email within 5 minutes</li>
							<li>• Contact the hotel 48 hours before arrival for early check-in</li>
							<li>• Present your ID and confirmation number at check-in</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to="/"
								className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
							>
								Back to Home
							</Link>
							<Link
								to="/dashboard"
								className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
							>
								View My Bookings
							</Link>
							<button
								onClick={() => window.print()}
								className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
							>
								Print Confirmation
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
