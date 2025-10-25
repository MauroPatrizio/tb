// src/components/LoadingSpinner.tsx
export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div className="flex justify-center items-center">
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
			/>
		</div>
	);
};

// src/components/SkeletonLoader.tsx
export const SkeletonLoader: React.FC = () => {
	return (
		<div className="animate-pulse">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((item) => (
					<div
						key={item}
						className="bg-white rounded-lg shadow-md overflow-hidden"
					>
						<div className="h-48 bg-gray-300" />
						<div className="p-4 space-y-3">
							<div className="h-4 bg-gray-300 rounded w-3/4" />
							<div className="h-3 bg-gray-300 rounded w-1/2" />
							<div className="h-3 bg-gray-300 rounded w-2/3" />
							<div className="flex justify-between">
								<div className="h-6 bg-gray-300 rounded w-1/4" />
								<div className="h-8 bg-gray-300 rounded w-1/3" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
