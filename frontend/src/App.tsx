import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MobileLayout from './components/Layout/MobileLayout'
import Home from './pages/Home'
import Map from './pages/Map'
import Events from './pages/Events'
import FoodTrucks from './pages/FoodTrucks'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/Admin/Dashboard'
import VendorDashboard from './pages/Vendor/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentVerification from './pages/StudentVerification'

function App() {
  return (
    <Router>
      <Routes>
        {/* 인증 페이지 (레이아웃 없음) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-verification" element={<StudentVerification />} />

        {/* 메인 앱 페이지 (MobileLayout 적용) */}
        <Route
          path="/*"
          element={
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
          }
        />
      </Routes>
    </Router>
  )
}

export default App
