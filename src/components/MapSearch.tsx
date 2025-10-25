import { useState, type FC } from "react";
import { useMapStore } from "../stores/mapStore";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const MapSearch: FC = () => {
	const [query, setQuery] = useState("");
	const { setViewport } = useMapStore();

	const popularCities = [
		{ name: "Mendoza, Argentina", coords: [-32.89084, -68.82717] as [number, number] },
		{ name: "Buenos Aires, Argentina", coords: [-34.6037, -58.3816] as [number, number] },
		{ name: "Córdoba, Argentina", coords: [-31.4201, -64.1888] as [number, number] },
		{ name: "Bariloche, Argentina", coords: [-41.1335, -71.3103] as [number, number] },
		{ name: "Santiago, Chile", coords: [-33.4489, -70.6693] as [number, number] },
		{ name: "Lima, Perú", coords: [-12.0464, -77.0428] as [number, number] },
	];

	const handleCitySelect = (coords: [number, number]) => {
		setViewport({
			center: coords,
			zoom: 12,
		});
		setQuery("");
	};

	const filteredCities = popularCities.filter((city) =>
		city.name.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="relative">
			<div className="relative">
				<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Buscar ciudad..."
					className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
				/>
			</div>

			{query && filteredCities.length > 0 && (
				<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
					{filteredCities.map((city, index) => (
						<button
							key={index}
							onClick={() => handleCitySelect(city.coords)}
							className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 last:border-b-0"
						>
							{city.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
