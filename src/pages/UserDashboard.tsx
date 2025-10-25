import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useBookingStore } from "../stores/bookingStore";
import { useNavigate } from "react-router-dom";
import {
	CalendarIcon,
	UserCircleIcon,
	CogIcon,
	HeartIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

export const UserDashboard: React.FC = () => {
	const { user, isAuthenticated } = useAuthStore();
	const { bookings, getUserBookings, cancelBooking, loading } = useBookingStore();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("bookings");

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		getUserBookings();
	}, [isAuthenticated, navigate, getUserBookings]);

	if (!isAuthenticated || !user) {
		return null;
	}

	const handleCancelBooking = async (bookingId: string) => {
		if (window.confirm("Are you sure you want to cancel this booking?")) {
			try {
				await cancelBooking(bookingId);
			} catch (error) {
				alert("Failed to cancel booking");
			}
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getUpcomingBookings = () => {
		const now = new Date();
		return bookings.filter(
			(booking) => new Date(booking.checkIn) > now && booking.status !== "cancelled"
		);
	};

	const getPastBookings = () => {
		const now = new Date();
		return bookings.filter(
			(booking) => new Date(booking.checkIn) <= now || booking.status === "cancelled"
		);
	};

	const upcomingBookings = getUpcomingBookings();
	const pastBookings = getPastBookings();

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<div className="flex items-center space-x-4">
							<UserCircleIcon className="h-16 w-16 text-gray-400" />
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Welcome back, {user.firstName}!
								</h1>
								<p className="text-gray-600">{user.email}</p>
								<p className="text-sm text-gray-500">
									Member since {new Date(user.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Sidebar */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-md p-4">
								<nav className="space-y-2">
									<button
										onClick={() => setActiveTab("bookings")}
										className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
											activeTab === "bookings"
												? "bg-blue-100 text-blue-700"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<CalendarIcon className="h-5 w-5" />
										<span>My Bookings</span>
										{upcomingBookings.length > 0 && (
											<span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
												{upcomingBookings.length}
											</span>
										)}
									</button>

									<button
										onClick={() => setActiveTab("profile")}
										className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
											activeTab === "profile"
												? "bg-blue-100 text-blue-700"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<UserCircleIcon className="h-5 w-5" />
										<span>Profile</span>
									</button>

									<button
										onClick={() => setActiveTab("favorites")}
										className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
											activeTab === "favorites"
												? "bg-blue-100 text-blue-700"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<HeartIcon className="h-5 w-5" />
										<span>Favorites</span>
									</button>

									<button
										onClick={() => setActiveTab("settings")}
										className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
											activeTab === "settings"
												? "bg-blue-100 text-blue-700"
												: "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<CogIcon className="h-5 w-5" />
										<span>Settings</span>
									</button>
								</nav>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-3">
							{activeTab === "bookings" && (
								<div className="space-y-6">
									{/* Upcoming Bookings */}
									{upcomingBookings.length > 0 && (
										<div className="bg-white rounded-lg shadow-md">
											<div className="p-6 border-b border-gray-200">
												<h2 className="text-xl font-semibold text-gray-900">
													Upcoming Bookings
												</h2>
											</div>
											<div className="divide-y divide-gray-200">
												{upcomingBookings.map((booking) => (
													<div
														key={booking.id}
														className="p-6"
													>
														<div className="flex justify-between items-start mb-4">
															<div>
																<h3 className="text-lg font-semibold text-gray-900">
																	Booking #{booking.id}
																</h3>
																<p className="text-gray-600">
																	{formatDate(booking.checkIn)} -{" "}
																	{formatDate(booking.checkOut)}
																</p>
															</div>
															<span
																className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
																	booking.status === "confirmed"
																		? "bg-green-100 text-green-800"
																		: booking.status ===
																		  "pending"
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-red-100 text-red-800"
																}`}
															>
																{booking.status
																	.charAt(0)
																	.toUpperCase() +
																	booking.status.slice(1)}
															</span>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
															<div>
																<p className="text-sm text-gray-600">
																	Guests
																</p>
																<p className="font-medium">
																	{booking.guests} guests
																</p>
															</div>
															<div>
																<p className="text-sm text-gray-600">
																	Total Price
																</p>
																<p className="font-medium">
																	${booking.totalPrice}
																</p>
															</div>
															<div>
																<p className="text-sm text-gray-600">
																	Booked On
																</p>
																<p className="font-medium">
																	{formatDate(booking.createdAt)}
																</p>
															</div>
														</div>

														{booking.specialRequests && (
															<div className="mb-4">
																<p className="text-sm text-gray-600">
																	Special Requests:
																</p>
																<p className="text-sm text-gray-700">
																	{booking.specialRequests}
																</p>
															</div>
														)}

														<div className="flex space-x-3">
															<button
																onClick={() =>
																	navigate(
																		`/hotel/${booking.hotelId}`
																	)
																}
																className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
															>
																View Hotel
															</button>

															{booking.status === "confirmed" && (
																<button
																	onClick={() =>
																		handleCancelBooking(
																			booking.id
																		)
																	}
																	className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
																>
																	Cancel Booking
																</button>
															)}
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Past Bookings */}
									{pastBookings.length > 0 && (
										<div className="bg-white rounded-lg shadow-md">
											<div className="p-6 border-b border-gray-200">
												<h2 className="text-xl font-semibold text-gray-900">
													Past Bookings
												</h2>
											</div>
											<div className="divide-y divide-gray-200">
												{pastBookings.map((booking) => (
													<div
														key={booking.id}
														className="p-6"
													>
														<div className="flex justify-between items-start mb-4">
															<div>
																<h3 className="text-lg font-semibold text-gray-900">
																	Booking #{booking.id}
																</h3>
																<p className="text-gray-600">
																	{formatDate(booking.checkIn)} -{" "}
																	{formatDate(booking.checkOut)}
																</p>
															</div>
															<span
																className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
																	booking.status === "confirmed"
																		? "bg-green-100 text-green-800"
																		: booking.status ===
																		  "cancelled"
																		? "bg-red-100 text-red-800"
																		: "bg-yellow-100 text-yellow-800"
																}`}
															>
																{booking.status
																	.charAt(0)
																	.toUpperCase() +
																	booking.status.slice(1)}
															</span>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
															<div>
																<p className="text-sm text-gray-600">
																	Guests
																</p>
																<p className="font-medium">
																	{booking.guests} guests
																</p>
															</div>
															<div>
																<p className="text-sm text-gray-600">
																	Total Price
																</p>
																<p className="font-medium">
																	${booking.totalPrice}
																</p>
															</div>
															<div>
																<p className="text-sm text-gray-600">
																	Booked On
																</p>
																<p className="font-medium">
																	{formatDate(booking.createdAt)}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* No Bookings */}
									{bookings.length === 0 && !loading && (
										<div className="bg-white rounded-lg shadow-md p-6 text-center">
											<CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<h3 className="text-lg font-medium text-gray-900 mb-2">
												No bookings yet
											</h3>
											<p className="text-gray-600 mb-4">
												Start planning your next trip!
											</p>
											<button
												onClick={() => navigate("/")}
												className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
											>
												Explore Hotels
											</button>
										</div>
									)}

									{loading && (
										<div className="bg-white rounded-lg shadow-md p-6 text-center">
											<div className="text-gray-600">Loading bookings...</div>
										</div>
									)}
								</div>
							)}

							{activeTab === "profile" && (
								<div className="bg-white rounded-lg shadow-md p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">
										Profile Information
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												First Name
											</label>
											<input
												type="text"
												value={user.firstName}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Last Name
											</label>
											<input
												type="text"
												value={user.lastName}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Email
											</label>
											<input
												type="email"
												value={user.email}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Phone
											</label>
											<input
												type="tel"
												value={user.phone}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												DNI
											</label>
											<input
												type="text"
												value={user.dni}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Member Since
											</label>
											<input
												type="text"
												value={new Date(
													user.createdAt
												).toLocaleDateString()}
												readOnly
												className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
											/>
										</div>
									</div>
								</div>
							)}

							{activeTab === "favorites" && (
								<div className="bg-white rounded-lg shadow-md p-6 text-center">
									<HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No favorites yet
									</h3>
									<p className="text-gray-600 mb-4">
										Save your favorite hotels for quick access.
									</p>
									<button
										onClick={() => navigate("/")}
										className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
									>
										Browse Hotels
									</button>
								</div>
							)}

							{activeTab === "settings" && (
								<div className="bg-white rounded-lg shadow-md p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">
										Account Settings
									</h2>
									<div className="space-y-4">
										<div className="p-4 border border-gray-200 rounded-lg">
											<h3 className="font-medium text-gray-900 mb-2">
												Notifications
											</h3>
											<p className="text-gray-600 text-sm mb-3">
												Manage your notification preferences
											</p>
											<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
												Configure Notifications
											</button>
										</div>

										<div className="p-4 border border-gray-200 rounded-lg">
											<h3 className="font-medium text-gray-900 mb-2">
												Privacy & Security
											</h3>
											<p className="text-gray-600 text-sm mb-3">
												Update your privacy settings and password
											</p>
											<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
												Privacy Settings
											</button>
										</div>

										<div className="p-4 border border-red-200 rounded-lg bg-red-50">
											<h3 className="font-medium text-red-900 mb-2">
												Danger Zone
											</h3>
											<p className="text-red-700 text-sm mb-3">
												Permanently delete your account and all data
											</p>
											<button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
												Delete Account
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
