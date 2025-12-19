import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import MobileLayout from './components/Layout/MobileLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from './components/ui/Toast'
import { useSocket, useNotifications } from './hooks/useSocket'
import Home from './pages/Home'
import Map from './pages/Map'
import Booths from './pages/Booths'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import FoodTrucks from './pages/FoodTrucks'
import FoodTruckDetail from './pages/FoodTruckDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminHome from './pages/Admin/AdminHome'
import EventManagement from './pages/Admin/EventManagement'
import ReservationManagement from './pages/Admin/ReservationManagement'
import QRScanner from './pages/Admin/QRScanner'
import Statistics from './pages/Admin/Statistics'
import BoothZoneEditor from './pages/Admin/BoothZoneEditor'
import FoodTruckManagement from './pages/Admin/FoodTruckManagement'
import VendorDashboard from './pages/Vendor/Dashboard'
import MenuManagement from './pages/Vendor/MenuManagement'
import OrderManagement from './pages/Vendor/OrderManagement'
import SalesReport from './pages/Vendor/SalesReport'
import VendorStats from './pages/Vendor/Stats'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentVerification from './pages/StudentVerification'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Socket.IO 연결 및 알림을 위한 별도 컴포넌트
function SocketProvider({ children }: { children: React.ReactNode }) {
  useSocket()
  useNotifications()
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SocketProvider>
          <Router>
            <Routes>
              {/* 인증 페이지 (레이아웃 없음) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/student-verification" element={<StudentVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* 메인 앱 페이지 (MobileLayout 적용) */}
              <Route
                path="/*"
                element={
                  <MobileLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/map" element={<Map />} />
                      <Route path="/booths" element={<Booths />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:id" element={<EventDetail />} />
                      <Route path="/foodtrucks" element={<FoodTrucks />} />
                      <Route path="/foodtrucks/:id" element={<FoodTruckDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/payment/success" element={<PaymentSuccess />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/:id" element={<OrderDetail />} />
                      <Route path="/my-reservations" element={<MyReservations />} />
                      <Route path="/profile" element={<Profile />} />

                      {/* 관리자 페이지 */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/home" element={<AdminHome />} />
                      <Route path="/admin/events" element={<EventManagement />} />
                      <Route path="/admin/reservations" element={<ReservationManagement />} />
                      <Route path="/admin/qr-scanner" element={<QRScanner />} />
                      <Route path="/admin/stats" element={<Statistics />} />
                      <Route path="/admin/booth-zones" element={<BoothZoneEditor />} />
                      <Route path="/admin/foodtrucks" element={<FoodTruckManagement />} />

                      {/* 푸드트럭 운영자 페이지 */}
                      <Route path="/vendor" element={<VendorDashboard />} />
                      <Route path="/vendor/menu" element={<MenuManagement />} />
                      <Route path="/vendor/orders" element={<OrderManagement />} />
                      <Route path="/vendor/sales" element={<SalesReport />} />
                      <Route path="/vendor/stats" element={<VendorStats />} />
                    </Routes>
                  </MobileLayout>
                }
              />
            </Routes>
            <ToastContainer />
          </Router>
        </SocketProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App
