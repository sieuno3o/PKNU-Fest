import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, MapPin, UtensilsCrossed, User } from 'lucide-react'

export default function BottomNavigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/events', label: '행사', icon: Calendar },
    { path: '/map', label: '지도', icon: MapPin },
    { path: '/foodtrucks', label: '음식', icon: UtensilsCrossed },
    { path: '/my-reservations', label: 'MY', icon: User },
  ]

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
              className={`flex flex-col items-center justify-center flex-1 h-full transition ${
                isActive
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
