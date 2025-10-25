import { StarIcon, MapPinIcon, WifiIcon } from "@heroicons/react/24/solid";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import type { Hotel } from "../types";

interface HotelCardProps {
	hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
	const mainImage = hotel.images?.[0] || "/api/placeholder/400/250";
	const location = `${hotel.city}, ${hotel.country}`;

	// Amenities comunes para mostrar
	const commonAmenities = ["wifi", "pool", "breakfast", "parking", "gym"];
	const displayedAmenities =
		hotel.amenities
			?.filter((amenity) => commonAmenities.includes(amenity.toLowerCase()))
			.slice(0, 3) || [];

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700">
			{/* Imagen del hotel */}
			<div className="relative overflow-hidden">
				<img
					src={mainImage}
					alt={hotel.name}
					className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute top-3 right-3 flex space-x-2">
					<button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
						<EyeIcon className="h-4 w-4 text-gray-700" />
					</button>
					<button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
						<HeartIcon className="h-4 w-4 text-gray-700" />
					</button>
				</div>

				{/* Badge de disponibilidad */}
				{!hotel.available && (
					<div className="absolute top-3 left-3">
						<span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
							No disponible
						</span>
					</div>
				)}
			</div>

			{/* Contenido */}
			<div className="p-4">
				{/* Nombre y precio */}
				<div className="flex justify-between items-start mb-2">
					<h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1 flex-1 mr-2">
						{hotel.name}
					</h3>
					<div className="text-right flex-shrink-0">
						<p className="text-2xl font-bold text-primary-600">
							${hotel.pricePerNight}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">por noche</p>
					</div>
				</div>

				{/* Ubicación */}
				<div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
					<MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
					<span className="line-clamp-1">{location}</span>
				</div>

				{/* Rating */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-1">
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<StarIcon
									key={star}
									className={`h-4 w-4 ${
										star <= Math.floor(hotel.rating || 0)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
						<span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
							{hotel.rating?.toFixed(1)}
						</span>
					</div>

					{/* Tipo de habitación y huéspedes */}
					<div className="text-right">
						<span className="text-sm text-gray-500 dark:text-gray-400 block">
							{hotel.roomType}
						</span>
						<span className="text-xs text-gray-400 dark:text-gray-500">
							Máx. {hotel.maxGuests} {hotel.maxGuests === 1 ? "huésped" : "huéspedes"}
						</span>
					</div>
				</div>

				{/* Amenities */}
				{displayedAmenities.length > 0 && (
					<div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
						{displayedAmenities.map((amenity) => (
							<div
								key={amenity}
								className="flex items-center space-x-1"
							>
								<WifiIcon className="h-4 w-4" />
								<span className="capitalize">{amenity}</span>
							</div>
						))}
						{hotel.amenities?.length > 3 && (
							<span className="text-xs text-gray-500">
								+{hotel.amenities.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Descripción breve */}
				{hotel.description && (
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
						{hotel.description}
					</p>
				)}

				{/* Botón de reserva */}
				<button
					className={`w-full font-semibold py-3 rounded-lg transition-colors duration-200 ${
						hotel.available
							? "bg-primary-600 hover:bg-primary-700 text-white"
							: "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
					}`}
					disabled={!hotel.available}
				>
					{hotel.available ? "Reservar ahora" : "No disponible"}
				</button>
			</div>
		</div>
	);
};
