// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../stores/authStore";

interface RegisterForm {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dni: string;
	password: string;
	confirmPassword: string;
}

export const Register: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const { register: registerUser } = useAuthStore();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<RegisterForm>();

	const password = watch("password");

	const onSubmit = async (data: RegisterForm) => {
		setLoading(true);
		try {
			await registerUser({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				dni: data.dni,
				password: data.password,
			});
			navigate("/");
		} catch (error) {
			console.error("Registration failed:", error);
			alert("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Or{" "}
					<Link
						to="/login"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						sign in to your existing account
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-700"
								>
									First Name
								</label>
								<div className="mt-1">
									<input
										{...register("firstName", {
											required: "First name is required",
										})}
										type="text"
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.firstName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.firstName.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700"
								>
									Last Name
								</label>
								<div className="mt-1">
									<input
										{...register("lastName", {
											required: "Last name is required",
										})}
										type="text"
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.lastName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="mt-1">
								<input
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^\S+@\S+$/i,
											message: "Invalid email address",
										},
									})}
									type="email"
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-gray-700"
								>
									Phone
								</label>
								<div className="mt-1">
									<input
										{...register("phone", { required: "Phone is required" })}
										type="tel"
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.phone && (
										<p className="mt-1 text-sm text-red-600">
											{errors.phone.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor="dni"
									className="block text-sm font-medium text-gray-700"
								>
									DNI
								</label>
								<div className="mt-1">
									<input
										{...register("dni", { required: "DNI is required" })}
										type="text"
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
									{errors.dni && (
										<p className="mt-1 text-sm text-red-600">
											{errors.dni.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="mt-1">
								<input
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
									type="password"
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								/>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700"
							>
								Confirm Password
							</label>
							<div className="mt-1">
								<input
									{...register("confirmPassword", {
										required: "Please confirm your password",
										validate: (value) =>
											value === password || "Passwords do not match",
									})}
									type="password"
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								/>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-600">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								{loading ? "Creating account..." : "Create account"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
