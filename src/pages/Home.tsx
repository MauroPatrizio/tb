import { useEffect, useState } from "react";
import { AdvancedSearchFilters } from "../components/AdvancedSearchFilters";
import { HotelCard } from "../components/HotelCard";
import { useHotelStore } from "../stores/hotelStore";
import { SkeletonLoader } from "../components/LoadingSpinner";

export const Home: React.FC = () => {
	const { hotels, featuredHotels, loading, searchHotels, getFeaturedHotels } = useHotelStore();
	const [searchPerformed, setSearchPerformed] = useState(false);

	useEffect(() => {
		getFeaturedHotels();
	}, [getFeaturedHotels]);

	const handleSearch = async () => {
		setSearchPerformed(true);
		await searchHotels();
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
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
						<AdvancedSearchFilters onSearch={handleSearch} />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-white dark:bg-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
							¿Por qué elegirnos?
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Ofrecemos la mejor experiencia de reserva con beneficios exclusivos para
							nuestros usuarios
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

			{/* Featured Hotels */}
			{featuredHotels.length > 0 && !searchPerformed && (
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
			)}

			{/* Search Results */}
			{searchPerformed && (
				<section className="py-16 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
							Resultados de Búsqueda
							{hotels.length > 0 && (
								<span className="text-orange-600 dark:text-orange-400">
									{" "}
									({hotels.length} encontrados)
								</span>
							)}
						</h2>

						{loading ? (
							<SkeletonLoader />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{hotels.map((hotel) => (
									<HotelCard
										key={hotel.id}
										hotel={hotel}
									/>
								))}
							</div>
						)}

						{!loading && hotels.length === 0 && (
							<div className="text-center py-12">
								<div className="text-gray-400 text-6xl mb-4">🏨</div>
								<h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
									No encontramos hoteles
								</h3>
								<p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto text-lg">
									Intenta ajustar tus filtros de búsqueda
								</p>
							</div>
						)}
					</div>
				</section>
			)}

			{/* CTA Section */}
			{!searchPerformed && (
				<section className="py-16 bg-gray-900 text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-bold mb-4">
							¿Listo para tu próxima aventura?
						</h2>
						<p className="text-xl mb-8 text-gray-300">
							Únete a millones de viajeros que confían en nosotros
						</p>
						<button
							onClick={() =>
								document
									.getElementById("search-section")
									?.scrollIntoView({ behavior: "smooth" })
							}
							className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors"
						>
							Buscar Hoteles
						</button>
					</div>
				</section>
			)}
		</div>
	);
};
