import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center space-x-3"
					>
						<div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">B</span>
						</div>
						<span className="text-xl font-bold text-gray-900 dark:text-white">
							BookingApp
						</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							to="/"
							className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						>
							Inicio
						</Link>
						{isAuthenticated && (
							<Link
								to="/dashboard"
								className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								Mis Viajes
							</Link>
						)}
					</div>

					{/* Right Section */}
					<div className="flex items-center space-x-4">
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Auth Section */}
						{isAuthenticated ? (
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
											{user?.firstName?.charAt(0)}
										</span>
									</div>
									<span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
										Hola, {user?.firstName}
									</span>
								</div>
								<button
									onClick={handleLogout}
									className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
								>
									Cerrar Sesión
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-3">
								<Link
									to="/login"
									className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Iniciar Sesión
								</Link>
								<Link
									to="/register"
									className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
								>
									Registrarse
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
