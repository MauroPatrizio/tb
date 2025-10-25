import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapStore } from "../stores/mapStore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Hotel } from "../types";

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Icono personalizado para hoteles
const hotelIcon = new L.Icon({
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

// Componente para controlar el viewport del mapa
const MapController: React.FC = () => {
	const map = useMap();
	const { viewport, setBounds } = useMapStore();

	useEffect(() => {
		map.setView(viewport.center, viewport.zoom);
	}, [map, viewport]);

	// Actualizar bounds cuando el mapa se mueve
	useEffect(() => {
		const updateBounds = () => {
			const bounds = map.getBounds();
			setBounds({
				north: bounds.getNorth(),
				south: bounds.getSouth(),
				east: bounds.getEast(),
				west: bounds.getWest(),
			});
		};

		map.on("moveend", updateBounds);
		return () => {
			map.off("moveend", updateBounds);
		};
	}, [map, setBounds]);

	return null;
};

interface HotelsMapProps {
	hotels: Hotel[];
	onHotelClick?: (hotel: Hotel) => void;
	height?: string;
}

export const HotelsMap: React.FC<HotelsMapProps> = ({ hotels, onHotelClick, height = "500px" }) => {
	const { viewport } = useMapStore();

	// Usar coordenadas reales del hotel
	const getHotelCoordinates = (hotel: Hotel): [number, number] => {
		// Si el hotel tiene coordenadas reales, usarlas
		if (hotel.latitude && hotel.longitude) {
			return [hotel.latitude, hotel.longitude];
		}

		// Fallback: coordenadas alrededor de Mendoza
		const mendozaAreas: [number, number][] = [
			[-32.89084, -68.82717], // Centro de Mendoza
			[-32.88084, -68.83717], // Este
			[-32.90084, -68.81717], // Oeste
		];

		const areaIndex = Math.floor(Math.random() * mendozaAreas.length);
		const baseCoord = mendozaAreas[areaIndex];

		const latVariation = (Math.random() - 0.5) * 0.01;
		const lngVariation = (Math.random() - 0.5) * 0.01;

		return [baseCoord[0] + latVariation, baseCoord[1] + lngVariation];
	};

	if (!hotels.length) {
		return (
			<div
				className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
				style={{ height }}
			>
				<div className="text-center">
					<div className="text-4xl mb-4">🗺️</div>
					<p className="text-gray-600 dark:text-gray-300">
						No hay hoteles para mostrar en el mapa
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
			<MapContainer
				center={viewport.center}
				zoom={viewport.zoom}
				style={{ height, width: "100%" }}
				scrollWheelZoom={true}
				className="rounded-lg"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<MapController />

				{hotels.map((hotel) => {
					const coordinates = getHotelCoordinates(hotel);

					return (
						<Marker
							key={hotel.id}
							position={coordinates}
							icon={hotelIcon}
							eventHandlers={{
								click: () => onHotelClick?.(hotel),
							}}
						>
							<Popup>
								<div className="min-w-[200px]">
									<img
										src={hotel.images[0]}
										alt={hotel.name}
										className="w-full h-24 object-cover rounded-lg mb-2"
									/>
									<h3 className="font-semibold text-gray-900 mb-1">
										{hotel.name}
									</h3>
									<p className="text-sm text-gray-600 mb-2">
										{hotel.city}, {hotel.country}
									</p>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<span className="text-yellow-500 mr-1">★</span>
											<span className="text-sm font-medium">
												{hotel.rating}
											</span>
										</div>
										<div className="text-lg font-bold text-orange-600">
											${hotel.pricePerNight}
										</div>
									</div>
									<button
										onClick={() => onHotelClick?.(hotel)}
										className="w-full mt-3 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
									>
										Ver Detalles
									</button>
								</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</div>
	);
};
