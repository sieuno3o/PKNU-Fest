import { Link } from 'react-router-dom'
import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-4 h-14">
        {/* 로고 */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-lg text-gray-900">PKNU-Fest</span>
        </Link>

        {/* 우측 아이콘 */}
        <div className="flex items-center space-x-3">
          {/* 알림 */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5 text-gray-700" />
            {/* 알림 뱃지 (알림 있을 때) */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 프로필 */}
          <Link
            to="/profile"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <User className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  )
}
