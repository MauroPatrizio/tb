// src/components/PhotoGallery.tsx
import { useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PhotoGalleryProps {
	images: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
	const [selectedImage, setSelectedImage] = useState<number | null>(null);

	const openLightbox = (index: number) => {
		setSelectedImage(index);
	};

	const closeLightbox = () => {
		setSelectedImage(null);
	};

	const nextImage = () => {
		if (selectedImage !== null && selectedImage < images.length - 1) {
			setSelectedImage(selectedImage + 1);
		}
	};

	const prevImage = () => {
		if (selectedImage !== null && selectedImage > 0) {
			setSelectedImage(selectedImage - 1);
		}
	};

	return (
		<>
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="grid grid-cols-2 gap-2 p-2">
					{images.slice(0, 4).map((image, index) => (
						<div
							key={index}
							className={`relative ${
								index === 0 ? "col-span-2 row-span-2 h-64" : "h-32"
							} cursor-pointer`}
							onClick={() => openLightbox(index)}
						>
							<img
								src={image}
								alt={`Hotel view ${index + 1}`}
								className="w-full h-full object-cover rounded-lg"
							/>
							{index === 3 && images.length > 4 && (
								<div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
									<span className="text-white text-lg font-semibold">
										+{images.length - 4} more
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Lightbox */}
			{selectedImage !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
					<button
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
					>
						<XMarkIcon className="h-8 w-8" />
					</button>

					<button
						onClick={prevImage}
						disabled={selectedImage === 0}
						className="absolute left-4 text-white hover:text-gray-300 z-10 disabled:opacity-50"
					>
						<ChevronLeftIcon className="h-8 w-8" />
					</button>

					<button
						onClick={nextImage}
						disabled={selectedImage === images.length - 1}
						className="absolute right-4 text-white hover:text-gray-300 z-10 disabled:opacity-50"
					>
						<ChevronRightIcon className="h-8 w-8" />
					</button>

					<div className="max-w-4xl max-h-full p-4">
						<img
							src={images[selectedImage]}
							alt={`Hotel view ${selectedImage + 1}`}
							className="max-w-full max-h-full object-contain rounded-lg"
						/>
					</div>
				</div>
			)}
		</>
	);
};
