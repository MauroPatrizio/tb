import React, { useState, useRef, useEffect } from "react";
import { useHotelStore } from "../stores/hotelStore";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AdvancedSearchFiltersProps {
	onSearch?: () => void;
}

// Custom input component para el DatePicker
const CustomInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
	<input
		className="w-full text-sm font-normal text-gray-900 dark:text-white bg-transparent border-none outline-none cursor-pointer focus:ring-0 focus:outline-none"
		onClick={onClick}
		ref={ref}
		value={value}
		readOnly
		placeholder="Seleccionar fecha"
	/>
));

CustomInput.displayName = "CustomInput";

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ onSearch }) => {
	const { searchFilters, setSearchFilters, searchHotels } = useHotelStore();
	const [activeFilter, setActiveFilter] = useState<string>("");

	const checkInRef = useRef<any>(null);
	const checkOutRef = useRef<any>(null);

	const handleSearch = async () => {
		await searchHotels();
		onSearch?.();
	};

	const formatDate = (date: Date | null): string => {
		if (!date) return "";
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	const handleDestinationClick = () => {
		setActiveFilter("destination");
	};

	const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchFilters({ destination: e.target.value });
	};

	const handleCheckInClick = () => {
		setActiveFilter("checkIn");
		setTimeout(() => {
			checkInRef.current?.setOpen(true);
		}, 100);
	};

	const handleCheckOutClick = () => {
		setActiveFilter("checkOut");
		setTimeout(() => {
			checkOutRef.current?.setOpen(true);
		}, 100);
	};

	const handleDateChange = (field: "checkIn" | "checkOut", date: Date | null) => {
		setSearchFilters({
			[field]: date,
		});
	};

	const handleGuestsClick = () => {
		setActiveFilter("guests");
	};

	const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSearchFilters({ guests: parseInt(e.target.value) });
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".filter-item") && !target.closest(".react-datepicker")) {
				setActiveFilter("");
			}
		};

		if (activeFilter) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeFilter]);

	return (
		<>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-5xl mx-auto relative z-0">
				{/* Header */}
				<div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
						Encuentra tu hotel ideal
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Busca entre miles de hoteles con los mejores precios
					</p>
				</div>

				{/* Filtros principales - Todo en un renglón */}
				<div className="flex p-2">
					{/* Destino */}
					<div
						className={`filter-item flex-1 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 relative flex flex-col justify-center min-h-16 ${
							activeFilter === "destination"
								? "bg-gray-50 dark:bg-gray-700 border-2 border-primary-600"
								: "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
						}`}
						onClick={handleDestinationClick}
					>
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
							DÓNDE
						</div>
						{activeFilter === "destination" ? (
							<input
								type="text"
								value={searchFilters.destination}
								onChange={handleDestinationChange}
								placeholder="¿A dónde vas?"
								className="w-full text-sm font-normal text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0 focus:outline-none"
								autoFocus
								onBlur={() => setActiveFilter("")}
							/>
						) : (
							<div className="text-sm font-normal text-gray-900 dark:text-white truncate">
								{searchFilters.destination || "¿A dónde vas?"}
							</div>
						)}
					</div>

					{/* Separador */}
					<div className="flex items-center justify-center">
						<div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
					</div>

					{/* Check-In */}
					<div
						className={`filter-item flex-1 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 relative flex flex-col justify-center min-h-16 ${
							activeFilter === "checkIn"
								? "bg-gray-50 dark:bg-gray-700 border-2 border-primary-600"
								: "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
						}`}
						onClick={handleCheckInClick}
					>
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
							CHECK-IN
						</div>
						{activeFilter === "checkIn" ? (
							<DatePicker
								ref={checkInRef}
								selected={searchFilters.checkIn}
								onChange={(date: Date) => handleDateChange("checkIn", date)}
								selectsStart
								startDate={searchFilters.checkIn}
								endDate={searchFilters.checkOut}
								minDate={new Date()}
								customInput={<CustomInput />}
								dateFormat="dd/MM/yyyy"
								placeholderText="Seleccionar fecha"
								onCalendarClose={() => setActiveFilter("")}
								className="w-full"
								popperClassName="react-datepicker-custom"
								popperPlacement="bottom-start"
							/>
						) : (
							<div className="text-sm font-normal text-gray-900 dark:text-white truncate">
								{searchFilters.checkIn
									? formatDate(searchFilters.checkIn)
									: "Seleccionar fecha"}
							</div>
						)}
					</div>

					{/* Separador */}
					<div className="flex items-center justify-center">
						<div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
					</div>

					{/* Check-Out */}
					<div
						className={`filter-item flex-1 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 relative flex flex-col justify-center min-h-16 ${
							activeFilter === "checkOut"
								? "bg-gray-50 dark:bg-gray-700 border-2 border-primary-600"
								: "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
						}`}
						onClick={handleCheckOutClick}
					>
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
							CHECK-OUT
						</div>
						{activeFilter === "checkOut" ? (
							<DatePicker
								ref={checkOutRef}
								selected={searchFilters.checkOut}
								onChange={(date: Date) => handleDateChange("checkOut", date)}
								selectsEnd
								startDate={searchFilters.checkIn}
								endDate={searchFilters.checkOut}
								minDate={searchFilters.checkIn || new Date()}
								customInput={<CustomInput />}
								dateFormat="dd/MM/yyyy"
								placeholderText="Seleccionar fecha"
								onCalendarClose={() => setActiveFilter("")}
								className="w-full"
								popperClassName="react-datepicker-custom"
								popperPlacement="bottom-start"
							/>
						) : (
							<div className="text-sm font-normal text-gray-900 dark:text-white truncate">
								{searchFilters.checkOut
									? formatDate(searchFilters.checkOut)
									: "Agregar fecha"}
							</div>
						)}
					</div>

					{/* Separador */}
					<div className="flex items-center justify-center">
						<div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
					</div>

					{/* Huéspedes */}
					<div
						className={`filter-item flex-1 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 relative flex flex-col justify-center min-h-16 ${
							activeFilter === "guests"
								? "bg-gray-50 dark:bg-gray-700 border-2 border-primary-600"
								: "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
						}`}
						onClick={handleGuestsClick}
					>
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
							HUÉSPEDES
						</div>
						{activeFilter === "guests" ? (
							<select
								value={searchFilters.guests}
								onChange={handleGuestsChange}
								className="w-full text-sm font-normal text-gray-900 dark:text-white bg-transparent border-none outline-none cursor-pointer focus:ring-0 focus:outline-none"
								autoFocus
								onBlur={() => setActiveFilter("")}
							>
								{[1, 2, 3, 4, 5, 6].map((num) => (
									<option
										key={num}
										value={num}
									>
										{num} {num === 1 ? "Huésped" : "Huéspedes"}
									</option>
								))}
							</select>
						) : (
							<div className="text-sm font-normal text-gray-900 dark:text-white truncate">
								{searchFilters.guests === 1
									? "1 huésped"
									: `${searchFilters.guests} huéspedes`}
							</div>
						)}
					</div>

					{/* Separador */}
					<div className="flex items-center justify-center">
						<div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
					</div>

					{/* Botón de búsqueda */}
					<button
						onClick={handleSearch}
						className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ml-2 min-w-[100px] border-2 border-transparent"
					>
						<MagnifyingGlassIcon className="h-4 w-4" />
						<span>Buscar</span>
					</button>
				</div>
			</div>

			{/* Estilos para el DatePicker - Mismo diseño para light y dark */}
			<style>{`
				.react-datepicker-custom {
					font-family: inherit;
					border: 1px solid #e5e7eb;
					border-radius: 0.75rem;
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
					z-index: 10000 !important;
					background-color: white;
				}

				.react-datepicker-popper {
					z-index: 10000 !important;
				}

				.react-datepicker-popper[data-placement^="bottom"] {
					padding-top: 8px !important;
				}

				.react-datepicker__triangle {
					display: none;
				}

				.react-datepicker-custom .react-datepicker__header {
					background-color: #f9fbf9ff;
					border-bottom: 1px solid #ebe5e5ff;
					border-top-left-radius: 0.75rem;
					border-top-right-radius: 0.75rem;
				}

				.react-datepicker-custom .react-datepicker__current-month {
					color: #111827;
					font-weight: 600;
				}

				.react-datepicker-custom .react-datepicker__day-name {
					color: #6b7280;
					font-weight: 500;
				}

				.react-datepicker-custom .react-datepicker__day {
					color: #374151;
					border-radius: 0.375rem;
				}

				.react-datepicker-custom .react-datepicker__day:hover {
					background-color: #f3f4f6;
				}

				.react-datepicker-custom .react-datepicker__day--selected {
					background-color: #ea580c !important;
					color: white !important;
				}

				.react-datepicker-custom .react-datepicker__day--keyboard-selected {
					background-color: #fed7aa !important;
					color: #ea580c !important;
				}

				.react-datepicker-custom .react-datepicker__day--in-range {
					background-color: #ffedd5 !important;
					color: #ea580c !important;
				}

				/* Días pasados */
				.react-datepicker-custom .react-datepicker__day--disabled {
					color: #9ca3af !important;
					background-color: #f9fafb !important;
					cursor: not-allowed !important;
				}

				.react-datepicker-custom .react-datepicker__day--outside-month {
					color: #d1d5db !important;
				}

				.react-datepicker-custom .react-datepicker__navigation-icon::before {
					border-color: #806b6bff;
				}

				/* ========== MODO DARK ========== */
				.dark .react-datepicker-custom {
					background-color: white !important;
					border-color: #ebe7e5ff !important;
				}

				.dark .react-datepicker-custom .react-datepicker__header {
					background-color: #f9fafb !important;
					border-color: #ebe7e5ff !important;
				}

				.dark .react-datepicker-custom .react-datepicker__current-month {
					color: #111827 !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day-name {
					color: #6b7280 !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day {
					color: #374151 !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day:hover {
					background-color: #f3f4f6 !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day--selected {
					background-color: #ea580c !important;
					color: white !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day--keyboard-selected {
					background-color: #fed7aa !important;
					color: #ea580c !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day--in-range {
					background-color: #ffedd5 !important;
					color: #ea580c !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day--disabled {
					color: #9ca3af !important;
					background-color: #f9fafb !important;
				}

				.dark .react-datepicker-custom .react-datepicker__day--outside-month {
					color: #d1d5db !important;
				}

				.dark .react-datepicker-custom .react-datepicker__navigation-icon::before {
					border-color: #6b7280 !important;
				}

				/* Asegurar que el datepicker se muestre por encima de todo */
				.react-datepicker-wrapper {
					width: 100%;
				}
			`}</style>
		</>
	);
};
