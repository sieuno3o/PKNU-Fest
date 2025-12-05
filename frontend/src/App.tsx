import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MobileLayout from './components/Layout/MobileLayout'
import Home from './pages/Home'
import Map from './pages/Map'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import FoodTrucks from './pages/FoodTrucks'
import FoodTruckDetail from './pages/FoodTruckDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminHome from './pages/Admin/AdminHome'
import EventManagement from './pages/Admin/EventManagement'
import ReservationManagement from './pages/Admin/ReservationManagement'
import QRScanner from './pages/Admin/QRScanner'
import VendorDashboard from './pages/Vendor/Dashboard'
import MenuManagement from './pages/Vendor/MenuManagement'
import OrderManagement from './pages/Vendor/OrderManagement'
import SalesReport from './pages/Vendor/SalesReport'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentVerification from './pages/StudentVerification'
import Profile from './pages/Profile'

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
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/foodtrucks" element={<FoodTrucks />} />
                <Route path="/foodtrucks/:id" element={<FoodTruckDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route path="/profile" element={<Profile />} />

                {/* 관리자 페이지 */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/admin/events" element={<EventManagement />} />
                <Route path="/admin/reservations" element={<ReservationManagement />} />
                <Route path="/admin/qr-scanner" element={<QRScanner />} />

                {/* 푸드트럭 운영자 페이지 */}
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/vendor/menu" element={<MenuManagement />} />
                <Route path="/vendor/orders" element={<OrderManagement />} />
                <Route path="/vendor/sales" element={<SalesReport />} />
              </Routes>
            </MobileLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
