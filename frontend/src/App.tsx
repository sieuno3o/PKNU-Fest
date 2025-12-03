import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MobileLayout from './components/Layout/MobileLayout'
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
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/events" element={<Events />} />
          <Route path="/foodtrucks" element={<FoodTrucks />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendor" element={<VendorDashboard />} />
        </Routes>
      </MobileLayout>
    </Router>
  )
}

export default App
