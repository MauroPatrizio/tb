import { useHotelStore } from "../stores/hotelStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const Pagination: React.FC = () => {
	const { currentPage, totalResults, searchHotels, loading } = useHotelStore();

	const resultsPerPage = 12;
	const totalPages = Math.ceil(totalResults / resultsPerPage);

	if (totalPages <= 1) return null;

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages && !loading) {
			searchHotels(page);
		}
	};

	const getVisiblePages = () => {
		const pages = [];
		const showPages = 5;

		let start = Math.max(1, currentPage - Math.floor(showPages / 2));
		let end = Math.min(totalPages, start + showPages - 1);

		if (end - start + 1 < showPages) {
			start = Math.max(1, end - showPages + 1);
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	};

	return (
		<div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
			{/* Mobile */}
			<div className="flex flex-1 justify-between sm:hidden">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1 || loading}
					className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Anterior
				</button>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages || loading}
					className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Siguiente
				</button>
			</div>

			{/* Desktop */}
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700 dark:text-gray-300">
						Mostrando{" "}
						<span className="font-medium">
							{(currentPage - 1) * resultsPerPage + 1}
						</span>{" "}
						a{" "}
						<span className="font-medium">
							{Math.min(currentPage * resultsPerPage, totalResults)}
						</span>{" "}
						de <span className="font-medium">{totalResults}</span> resultados
					</p>
				</div>

				<div>
					<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
						{/* Previous Button */}
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1 || loading}
							className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="sr-only">Anterior</span>
							<ChevronLeftIcon className="h-5 w-5" />
						</button>

						{/* Page Numbers */}
						{getVisiblePages().map((page) => (
							<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
									currentPage === page
										? "bg-orange-600 text-white focus-visible:outline-orange-600"
										: "text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
								} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
								disabled={loading}
							>
								{page}
							</button>
						))}

						{/* Next Button */}
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages || loading}
							className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="sr-only">Siguiente</span>
							<ChevronRightIcon className="h-5 w-5" />
						</button>
					</nav>
				</div>
			</div>
		</div>
	);
};
