import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Calendar,
  MapPin,
  UtensilsCrossed,
  User,
  LayoutDashboard,
  Settings,
  ClipboardList,
  BarChart3,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function BottomNavigation() {
  const location = useLocation()
  const { user } = useAuth()

  // 역할별 네비게이션 메뉴
  const userNavItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/booths', label: '행사', icon: Calendar },
    { path: '/map', label: '지도', icon: MapPin },
    { path: '/foodtrucks', label: '음식', icon: UtensilsCrossed },
    { path: '/profile', label: 'MY', icon: User },
  ]

  const adminNavItems = [
    { path: '/', label: '대시보드', icon: LayoutDashboard },
    { path: '/admin/events', label: '행사관리', icon: Calendar },
    { path: '/admin/reservations', label: '예약관리', icon: ClipboardList },
    { path: '/admin/stats', label: '통계', icon: BarChart3 },
    { path: '/profile', label: 'MY', icon: User },
  ]

  const vendorNavItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/vendor/menu', label: '메뉴관리', icon: Settings },
    { path: '/vendor/orders', label: '주문관리', icon: ShoppingBag },
    { path: '/vendor/stats', label: '통계', icon: BarChart3 },
    { path: '/profile', label: 'MY', icon: User },
  ]

  // 역할에 따라 다른 메뉴 표시 (대소문자 구분 없이)
  let navItems = userNavItems
  const userRole = user?.role?.toLowerCase()
  if (userRole === 'admin') {
    navItems = adminNavItems
  } else if (userRole === 'vendor') {
    navItems = vendorNavItems
  }

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
