import { Link } from 'react-router-dom'
import { Bell, User, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  // 장바구니 개수 업데이트
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(totalCount)
    }

    // 초기 로드
    updateCartCount()

    // storage 이벤트 리스너 (다른 탭에서 변경시)
    window.addEventListener('storage', updateCartCount)

    // 커스텀 이벤트 리스너 (같은 탭에서 변경시)
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

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
          {/* 장바구니 */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {/* 장바구니 개수 뱃지 */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

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
