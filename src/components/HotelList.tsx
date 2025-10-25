import { useHotelStore } from "../stores/hotelStore";
import { HotelCard } from "./HotelCard";
import { MapPinIcon, FunnelIcon } from "@heroicons/react/24/outline";

export const HotelList = () => {
	const { hotels, loading, error, searchFilters } = useHotelStore();

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
				<p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
				<button
					onClick={() => useHotelStore.getState().clearError()}
					className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
				>
					Reintentar
				</button>
			</div>
		);
	}

	if (hotels.length === 0) {
		return (
			<div className="text-center py-12">
				<MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
				<h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
					No se encontraron hoteles
				</h3>
				<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
					{searchFilters.destination
						? `No hay resultados para "${searchFilters.destination}"`
						: "Realiza una búsqueda para ver hoteles disponibles"}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header con resultados */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						{searchFilters.destination
							? `Hoteles en ${searchFilters.destination}`
							: "Todos los hoteles"}
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						{hotels.length}{" "}
						{hotels.length === 1 ? "hotel encontrado" : "hoteles encontrados"}
					</p>
				</div>

				{/* Filtros (podemos expandir esto después) */}
				<button className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<FunnelIcon className="h-4 w-4" />
					<span>Filtrar</span>
				</button>
			</div>

			{/* Grid de hoteles */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{hotels.map((hotel) => (
					<HotelCard
						key={hotel.id}
						hotel={hotel}
					/>
				))}
			</div>
		</div>
	);
};
