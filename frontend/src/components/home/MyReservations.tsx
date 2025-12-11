import { Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'

interface MyReservationsProps {
  isLoggedIn: boolean
}

export default function MyReservations({ isLoggedIn }: MyReservationsProps) {
  return (
    <section className="px-4 py-6 bg-white">
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span>
        <span>내 예약</span>
      </h2>

      {!isLoggedIn ? (
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-20 rounded-full -ml-10 -mb-10"></div>

          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium mb-5">로그인하고 예약을 관리하세요</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogIn className="w-5 h-5 mr-2" />
              로그인하러 가기
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* TODO: 실제 예약 카드 렌더링 */}
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">예약이 없습니다</p>
          </div>
        </div>
      )}
    </section>
  )
}
