// src/pages/HotelDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHotelStore } from "../stores/hotelStore";
import type { Hotel } from "../types";
import { MapPinIcon, StarIcon, WifiIcon } from "@heroicons/react/24/solid";
import { PhotoGallery } from "../components/PhotoGallery";
import { HotelDetailMap } from "../components/HotelDetailMap";
import { BookingWidget } from "../components/BookingWidget";
import { ReviewSection } from "./ReviewSection";

export const HotelDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { selectedHotel, getHotelById } = useHotelStore();
	const [hotel, setHotel] = useState<Hotel | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadHotel = async () => {
			if (id) {
				const hotelData = await getHotelById(id);
				setHotel(hotelData);
			}
			setLoading(false);
		};
		loadHotel();
	}, [id, getHotelById]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-lg">Loading hotel details...</div>
			</div>
		);
	}

	if (!hotel) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h2>
					<button
						onClick={() => navigate("/")}
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
					>
						Back to Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
					<div className="flex items-center space-x-4 mb-4">
						<div className="flex items-center">
							<StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
							<span className="font-semibold">{hotel.rating}</span>
						</div>
						<div className="flex items-center text-gray-600">
							<MapPinIcon className="h-5 w-5 mr-1" />
							<span>
								{hotel.address}, {hotel.city}, {hotel.country}
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Photo Gallery */}
						<PhotoGallery images={hotel.images} />

						{/* Description */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold mb-4">About this property</h2>
							<p className="text-gray-700 leading-relaxed">{hotel.description}</p>
						</div>

						{/* Amenities */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold mb-4">Amenities</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{hotel.amenities.map((amenity, index) => (
									<div
										key={index}
										className="flex items-center space-x-2"
									>
										<WifiIcon className="h-5 w-5 text-green-500" />
										<span className="text-gray-700 capitalize">{amenity}</span>
									</div>
								))}
							</div>
						</div>

						{/* Map */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold mb-4">Location</h2>
							<div className="h-64 rounded-lg overflow-hidden">
								<HotelDetailMap hotel={hotel} />
							</div>
							<ReviewSection hotelId={hotel.id} />
						</div>
					</div>

					{/* Right Column - Booking Widget */}
					<div className="lg:col-span-1">
						<BookingWidget hotel={hotel} />
					</div>
				</div>
			</div>
		</div>
	);
};
