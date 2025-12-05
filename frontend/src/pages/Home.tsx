import { Link } from 'react-router-dom'
import { MapPin, Calendar, UtensilsCrossed, ChevronRight, LogIn, Clock, MapPinned } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AdminHome from './Admin/AdminHome'

export default function Home() {
  const { user, isAdmin } = useAuth()

  // 관리자는 관리자 대시보드 표시
  if (isAdmin) {
    return <AdminHome />
  }

  // TODO: 실제로는 API에서 가져올 데이터
  const isLoggedIn = !!user // 로그인 상태

  const ongoingEvents = [
    {
      id: '1',
      title: '아이유 콘서트',
      category: '🎵',
      time: '19:00',
      location: '대운동장',
      thumbnail: null,
      color: 'from-pink-500 to-purple-600',
    },
    {
      id: '2',
      title: '체험 부스',
      category: '🎨',
      time: '10:00',
      location: '학생회관',
      thumbnail: null,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: '3',
      title: '게임 대회',
      category: '🎮',
      time: '14:00',
      location: '대강당',
      thumbnail: null,
      color: 'from-blue-500 to-cyan-600',
    },
  ]

  const notices = [
    '우천 시 일부 행사 취소 가능',
    '캠퍼스 내 주차 불가',
  ]

  return (
    <div className="pb-4 bg-gradient-to-b from-gray-50 to-white">
      {/* 배너 섹션 */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white px-6 py-10 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

        <div className="relative text-center">
          <div className="text-5xl mb-3 animate-bounce">🎪</div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">PKNU 2025 봄 축제</h1>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            <p className="text-sm font-medium">5월 13일 - 15일</p>
          </div>
        </div>
      </section>

      {/* 빠른 바로가기 */}
      <section className="px-4 py-6 bg-white">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>빠른 바로가기</span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/map"
            className="group flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">전체 지도</span>
          </Link>
          <Link
            to="/events"
            className="group flex flex-col items-center justify-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">행사 목록</span>
          </Link>
          <Link
            to="/foodtrucks"
            className="group flex flex-col items-center justify-center p-5 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">푸드트럭</span>
          </Link>
        </div>
      </section>

      {/* 지금 진행 중 */}
      <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span>지금 진행 중</span>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {ongoingEvents.length}
            </span>
          </h2>
          <Link
            to="/events"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            더보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 가로 스크롤 카드 */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {ongoingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* 썸네일 */}
              <div className={`relative w-full h-24 bg-gradient-to-br ${event.color} flex items-center justify-center text-3xl overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative z-10">{event.category}</span>
              </div>

              {/* 카드 내용 */}
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPinned className="w-3.5 h-3.5" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 내 예약 */}
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

      {/* 공지사항 */}
      <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📢</span>
          <span>공지사항</span>
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {notices.map((notice, index) => (
            <div key={index} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 leading-relaxed">{notice}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
