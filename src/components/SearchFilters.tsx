// src/components/SearchFilters.tsx
import { useHotelStore } from "../stores/hotelStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const SearchFilters: React.FC = () => {
	const { searchFilters, setSearchFilters, searchHotels } = useHotelStore();

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{/* Destination */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Destination
					</label>
					<input
						type="text"
						value={searchFilters.destination}
						onChange={(e) => setSearchFilters({ destination: e.target.value })}
						placeholder="Where are you going?"
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Check-in */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
					<DatePicker
						selected={searchFilters.checkIn}
						onChange={(date) => setSearchFilters({ checkIn: date })}
						selectsStart
						startDate={searchFilters.checkIn}
						endDate={searchFilters.checkOut}
						minDate={new Date()}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholderText="Check-in date"
					/>
				</div>

				{/* Check-out */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Check-out
					</label>
					<DatePicker
						selected={searchFilters.checkOut}
						onChange={(date) => setSearchFilters({ checkOut: date })}
						selectsEnd
						startDate={searchFilters.checkIn}
						endDate={searchFilters.checkOut}
						minDate={searchFilters.checkIn || new Date()}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholderText="Check-out date"
					/>
				</div>

				{/* Guests */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
					<select
						value={searchFilters.guests}
						onChange={(e) => setSearchFilters({ guests: parseInt(e.target.value) })}
						className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					>
						{[1, 2, 3, 4, 5, 6].map((num) => (
							<option
								key={num}
								value={num}
							>
								{num} {num === 1 ? "Guest" : "Guests"}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mt-4 flex justify-end">
				<button
					onClick={searchHotels}
					className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
				>
					Search
				</button>
			</div>
		</div>
	);
};
