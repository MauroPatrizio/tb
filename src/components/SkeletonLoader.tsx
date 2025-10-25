export const SkeletonLoader: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{[1, 2, 3, 4, 5, 6].map((item) => (
				<div
					key={item}
					className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
				>
					<div className="h-48 bg-gray-300 dark:bg-gray-700" />
					<div className="p-4 space-y-3">
						<div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
						<div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
						<div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
						<div className="flex justify-between pt-4">
							<div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
							<div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
