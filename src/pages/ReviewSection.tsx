// src/components/ReviewSection.tsx
import { useEffect, useState, type FC } from "react";

import { StarIcon } from "@heroicons/react/24/solid";
import { useReviewStore } from "../stores/reviewStore";
import { useAuthStore } from "../stores/authStore";

interface ReviewSectionProps {
	hotelId: string;
}

export const ReviewSection: FC<ReviewSectionProps> = ({ hotelId }) => {
	const { reviews, reviewStats, loading, getHotelReviews, getReviewStats, addReview } =
		useReviewStore();
	const { isAuthenticated, user } = useAuthStore();
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [newReview, setNewReview] = useState({
		rating: 5,
		comment: "",
	});

	useEffect(() => {
		getHotelReviews(hotelId);
		getReviewStats(hotelId);
	}, [hotelId, getHotelReviews, getReviewStats]);

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAuthenticated || !user) {
			alert("Please login to submit a review");
			return;
		}

		try {
			await addReview({
				userId: user.id,
				hotelId,
				userName: `${user.firstName} ${user.lastName}`,
				rating: newReview.rating,
				comment: newReview.comment,
			});

			setNewReview({ rating: 5, comment: "" });
			setShowReviewForm(false);
		} catch (error) {
			alert("Failed to submit review");
		}
	};

	const calculatePercentage = (count: number, total: number) => {
		return total > 0 ? (count / total) * 100 : 0;
	};

	if (loading) {
		return <div className="text-center py-8">Loading reviews...</div>;
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-6">Guest Reviews</h2>

			{/* Review Stats */}
			{reviewStats && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					<div className="text-center">
						<div className="flex items-center justify-center mb-2">
							<span className="text-4xl font-bold text-gray-900 mr-2">
								{reviewStats.averageRating}
							</span>
							<div>
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<StarIcon
											key={star}
											className={`h-5 w-5 ${
												star <= Math.floor(reviewStats.averageRating)
													? "text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<p className="text-sm text-gray-600">
									{reviewStats.totalReviews} reviews
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						{[5, 4, 3, 2, 1].map((rating) => (
							<div
								key={rating}
								className="flex items-center space-x-2"
							>
								<span className="text-sm text-gray-600 w-4">{rating}</span>
								<StarIcon className="h-4 w-4 text-yellow-400" />
								<div className="flex-1 bg-gray-200 rounded-full h-2">
									<div
										className="bg-yellow-400 h-2 rounded-full"
										style={{
											width: `${calculatePercentage(
												reviewStats.ratingBreakdown[
													rating as keyof typeof reviewStats.ratingBreakdown
												],
												reviewStats.totalReviews
											)}%`,
										}}
									/>
								</div>
								<span className="text-sm text-gray-600 w-8">
									{
										reviewStats.ratingBreakdown[
											rating as keyof typeof reviewStats.ratingBreakdown
										]
									}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Add Review Button */}
			{isAuthenticated && !showReviewForm && (
				<button
					onClick={() => setShowReviewForm(true)}
					className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
				>
					Write a Review
				</button>
			)}

			{/* Review Form */}
			{showReviewForm && (
				<form
					onSubmit={handleSubmitReview}
					className="bg-gray-50 p-4 rounded-lg mb-6"
				>
					<h3 className="font-semibold mb-4">Write Your Review</h3>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Rating
						</label>
						<div className="flex space-x-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setNewReview({ ...newReview, rating: star })}
									className="focus:outline-none"
								>
									<StarIcon
										className={`h-8 w-8 ${
											star <= newReview.rating
												? "text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								</button>
							))}
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Comment
						</label>
						<textarea
							value={newReview.comment}
							onChange={(e) =>
								setNewReview({ ...newReview, comment: e.target.value })
							}
							rows={4}
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Share your experience..."
							required
						/>
					</div>

					<div className="flex space-x-2">
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
						>
							Submit Review
						</button>
						<button
							type="button"
							onClick={() => setShowReviewForm(false)}
							className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			{/* Reviews List */}
			<div className="space-y-6">
				{reviews.map((review) => (
					<div
						key={review.id}
						className="border-b border-gray-200 pb-6 last:border-0"
					>
						<div className="flex items-center justify-between mb-2">
							<div>
								<h4 className="font-semibold">{review.userName}</h4>
								<div className="flex items-center space-x-1">
									<div className="flex">
										{[1, 2, 3, 4, 5].map((star) => (
											<StarIcon
												key={star}
												className={`h-4 w-4 ${
													star <= review.rating
														? "text-yellow-400"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<span className="text-sm text-gray-600">
										{new Date(review.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
							{review.verified && (
								<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
									Verified
								</span>
							)}
						</div>
						<p className="text-gray-700">{review.comment}</p>
					</div>
				))}

				{reviews.length === 0 && (
					<p className="text-center text-gray-600 py-8">
						No reviews yet. Be the first to review!
					</p>
				)}
			</div>
		</div>
	);
};
