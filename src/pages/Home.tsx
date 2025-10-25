import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedSearchFilters } from "../components/AdvancedSearchFilters";
import { HotelCard } from "../components/HotelCard";
import { Pagination } from "../components/Pagination";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { HotelsMap } from "../components/HotelsMap";
import { MapToggle } from "../components/MapToggle";
import { MapSearch } from "../components/MapSearch";
import { useHotelStore } from "../stores/hotelStore";
import { useMapStore } from "../stores/mapStore";

export const Home: React.FC = () => {
	const {
		hotels,
		featuredHotels,
		loading,
		searchHotels,
		getFeaturedHotels,
		totalResults,
		currentPage,
	} = useHotelStore();
	const { isMapVisible } = useMapStore();
	const navigate = useNavigate();
	const [searchPerformed, setSearchPerformed] = useState(false);

	useEffect(() => {
		getFeaturedHotels();
	}, [getFeaturedHotels]);

	const handleSearch = async () => {
		setSearchPerformed(true);
		await searchHotels(1);
	};

	const features = [
		{
			icon: "🛡️",
			title: "Reserva Segura",
			description: "Pagos encriptados y reservas protegidas",
		},
		{
			icon: "⭐",
			title: "Mejores Precios",
			description: "Garantía del mejor precio o te devolvemos la diferencia",
		},
		{
			icon: "📞",
			title: "Soporte 24/7",
			description: "Nuestro equipo está disponible para ayudarte",
		},
		{
			icon: "📍",
			title: "Ubicaciones Perfectas",
			description: "Hoteles en las mejores ubicaciones",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Encuentra tu hotel perfecto
						</h1>
						<p className="text-xl md:text-2xl mb-8 text-orange-100">
							Descubre experiencias únicas en más de 10,000 destinos alrededor del
							mundo
						</p>
					</div>
				</div>
			</section>

			{/* Search Section */}
			<section className="bg-white dark:bg-gray-800 -mt-8 relative z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<AdvancedSearchFilters onSearch={handleSearch} />
				</div>
			</section>

			{/* Search Results */}
			{searchPerformed && (
				<section className="py-8 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{/* Results Header */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
							<div>
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									Resultados de Búsqueda
								</h2>
								<p className="text-gray-600 dark:text-gray-300 mt-1">
									{totalResults > 0 ? (
										<>
											Encontramos{" "}
											<span className="font-semibold text-orange-600 dark:text-orange-400">
												{totalResults}
											</span>{" "}
											hoteles
											{currentPage > 1 && ` - Página ${currentPage}`}
										</>
									) : (
										"No encontramos hoteles que coincidan con tu búsqueda"
									)}
								</p>
							</div>

							{/* Map Toggle */}
							<div className="flex items-center space-x-4 mt-4 sm:mt-0">
								<MapSearch />
								<MapToggle />
							</div>
						</div>

						{/* Content based on map visibility */}
						{isMapVisible ? (
							/* Vista Mapa */
							<div className="mb-8">
								<HotelsMap
									hotels={hotels}
									height="600px"
									onHotelClick={(hotel) => navigate(`/hotel/${hotel.id}`)}
								/>
							</div>
						) : (
							/* Vista Lista */
							<>
								{loading ? (
									<SkeletonLoader />
								) : hotels.length > 0 ? (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
											{hotels.map((hotel) => (
												<HotelCard
													key={hotel.id}
													hotel={hotel}
												/>
											))}
										</div>
										<Pagination />
									</>
								) : (
									<div className="text-center py-12">
										<div className="text-gray-400 text-6xl mb-4">🏨</div>
										<h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
											No encontramos hoteles
										</h3>
										<p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto text-lg mb-6">
											Intenta ajustar tus filtros de búsqueda o explorar
											destinos populares
										</p>
										<button
											onClick={() => setSearchPerformed(false)}
											className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
										>
											Ver Hoteles Destacados
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</section>
			)}

			{/* Featured Hotels */}
			{!searchPerformed && (
				<>
					<section className="py-16 bg-white dark:bg-gray-800">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
									¿Por qué elegirnos?
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
									Ofrecemos la mejor experiencia de reserva con beneficios
									exclusivos para nuestros usuarios
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
								{features.map((feature, index) => (
									<div
										key={index}
										className="text-center p-6"
									>
										<div className="text-4xl mb-4">{feature.icon}</div>
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
											{feature.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-300">
											{feature.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className="py-16 bg-gray-50 dark:bg-gray-900">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
									Hoteles Destacados
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-300">
									Descubre nuestros hoteles mejor calificados
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{featuredHotels.slice(0, 6).map((hotel) => (
									<HotelCard
										key={hotel.id}
										hotel={hotel}
									/>
								))}
							</div>
						</div>
					</section>
				</>
			)}
		</div>
	);
};
