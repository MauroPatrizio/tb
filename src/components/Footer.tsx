export const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">BookingApp</h3>
						<p className="text-gray-400 text-sm">
							Encuentra los mejores hoteles al mejor precio. Tu viaje perfecto
							comienza aquí.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Compañía</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Acerca de
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Carreras
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Mobile
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Contacto</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>help@bookingapp.com</li>
							<li>+1 (555) 123-4567</li>
							<li>Ciudad de México, MX</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Legal</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Términos
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Privacidad
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Cookies
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
					<p>&copy; 2024 BookingApp. Todos los derechos reservados.</p>
				</div>
			</div>
		</footer>
	);
};
