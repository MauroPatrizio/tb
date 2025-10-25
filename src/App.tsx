import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { HotelDetail } from "./pages/HotelDetail";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { UserDashboard } from "./pages/UserDashboard";

function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/hotel/:id"
						element={<HotelDetail />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="/booking-confirmation/:bookingId"
						element={<BookingConfirmation />}
					/>
					<Route
						path="/dashboard"
						element={<UserDashboard />}
					/>
				</Routes>
			</Layout>
		</Router>
	);
}

export default App;
