import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Hotel } from "../types";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface HotelDetailMapProps {
	hotel: Hotel;
}

// Componente para centrar el mapa cuando cambia el hotel
const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
	const map = useMap();

	useEffect(() => {
		map.setView(center, 15);
	}, [map, center]);

	return null;
};

export const HotelDetailMap: React.FC<HotelDetailMapProps> = ({ hotel }) => {
	const coordinates: [number, number] = [hotel.latitude, hotel.longitude];

	return (
		<MapContainer
			center={coordinates}
			zoom={15}
			style={{ height: "100%", width: "100%" }}
			scrollWheelZoom={true}
			className="rounded-lg"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MapCenter center={coordinates} />
			<Marker position={coordinates}>
				<Popup>
					<div className="p-2 min-w-[200px]">
						<h3 className="font-semibold text-gray-900">{hotel.name}</h3>
						<p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
						<p className="text-sm text-gray-600">
							{hotel.city}, {hotel.country}
						</p>
						<div className="flex items-center mt-2">
							<span className="text-yellow-500 mr-1">★</span>
							<span className="text-sm font-medium">{hotel.rating}</span>
						</div>
					</div>
				</Popup>
			</Marker>
		</MapContainer>
	);
};
