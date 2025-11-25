import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Map from './pages/Map'
import Events from './pages/Events'
import FoodTrucks from './pages/FoodTrucks'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/Admin/Dashboard'
import VendorDashboard from './pages/Vendor/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-xl font-bold text-blue-600">
                PKNU-Fest
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  홈
                </Link>
                <Link to="/map" className="text-gray-700 hover:text-blue-600">
                  지도
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-blue-600">
                  행사
                </Link>
                <Link to="/foodtrucks" className="text-gray-700 hover:text-blue-600">
                  푸드트럭
                </Link>
                <Link to="/my-reservations" className="text-gray-700 hover:text-blue-600">
                  내 예약
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/events" element={<Events />} />
            <Route path="/foodtrucks" element={<FoodTrucks />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/vendor" element={<VendorDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
