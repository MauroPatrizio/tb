// src/components/HotelMap.tsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

interface HotelMapProps {
	hotel: Hotel;
}

export const HotelMap: React.FC<HotelMapProps> = ({ hotel }) => {
	useEffect(() => {
		// Initialize map
	}, [hotel]);

	return (
		<MapContainer
			center={[hotel.latitude, hotel.longitude]}
			zoom={15}
			style={{ height: "100%", width: "100%" }}
			scrollWheelZoom={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[hotel.latitude, hotel.longitude]}>
				<Popup>
					<div className="p-2">
						<h3 className="font-semibold">{hotel.name}</h3>
						<p className="text-sm text-gray-600">{hotel.address}</p>
					</div>
				</Popup>
			</Marker>
		</MapContainer>
	);
};
