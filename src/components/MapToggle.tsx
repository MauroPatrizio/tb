import { useMapStore } from "../stores/mapStore";
import { MapIcon, ListBulletIcon } from "@heroicons/react/24/outline";

export const MapToggle: React.FC = () => {
	const { isMapVisible, toggleMapVisibility } = useMapStore();

	return (
		<div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
			<button
				onClick={() => !isMapVisible && toggleMapVisibility()}
				className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
					!isMapVisible
						? "bg-orange-600 text-white"
						: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
				}`}
			>
				<ListBulletIcon className="h-4 w-4" />
				<span className="text-sm font-medium">Lista</span>
			</button>

			<button
				onClick={() => isMapVisible && toggleMapVisibility()}
				className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
					isMapVisible
						? "bg-orange-600 text-white"
						: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
				}`}
			>
				<MapIcon className="h-4 w-4" />
				<span className="text-sm font-medium">Mapa</span>
			</button>
		</div>
	);
};
