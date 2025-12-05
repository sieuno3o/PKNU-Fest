import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
} from 'lucide-react'

export default function AdminHome() {
  // TODO: 실제로는 API에서 가져올 통계 데이터
  const stats = {
    totalEvents: 24,
    activeEvents: 8,
    totalReservations: 1256,
    todayReservations: 89,
    totalUsers: 3421,
    newUsersToday: 47,
    checkInRate: 78,
  }

  const recentReservations = [
    {
      id: 'res-101',
      userName: '김철수',
      eventName: '아이유 콘서트',
      time: '방금 전',
      status: 'confirmed',
    },
    {
      id: 'res-102',
      userName: '이영희',
      eventName: '체험 부스',
      time: '5분 전',
      status: 'confirmed',
    },
    {
      id: 'res-103',
      userName: '박민수',
      eventName: '게임 대회',
      time: '10분 전',
      status: 'cancelled',
    },
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: '아이유 콘서트',
      time: '오늘 19:00',
      reservations: 243,
      capacity: 300,
      status: 'active',
    },
    {
      id: '2',
      title: '체험 부스',
      time: '오늘 14:00',
      reservations: 156,
      capacity: 200,
      status: 'active',
    },
    {
      id: '3',
      title: '게임 대회',
      time: '내일 15:00',
      reservations: 98,
      capacity: 150,
      status: 'scheduled',
    },
  ]

  const alerts = [
    { type: 'warning', message: '아이유 콘서트 좌석이 90% 이상 예약되었습니다' },
    { type: 'info', message: '오늘 체크인율이 평균보다 낮습니다' },
  ]

  return (
    <div className="pb-4 bg-gray-50 min-h-full">
      {/* 헤더 */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">관리자 대시보드</h1>
            <p className="text-blue-100 text-sm">PKNU 축제 통합 관리</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* 주요 통계 */}
      <section className="px-4 -mt-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-500">진행중</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
            <p className="text-xs text-gray-600">전체 {stats.totalEvents}개</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-500">오늘</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.todayReservations}</p>
            <p className="text-xs text-gray-600">전체 {stats.totalReservations}건</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-500">+{stats.newUsersToday}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-600">전체 사용자</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-gray-500">체크인율</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.checkInRate}%</p>
            <p className="text-xs text-gray-600">평균 대비 -5%</p>
          </div>
        </div>
      </section>

      {/* 알림 */}
      {alerts.length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span>주요 알림</span>
          </h2>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${
                  alert.type === 'warning'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    alert.type === 'warning' ? 'text-orange-700' : 'text-blue-700'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 다가오는 행사 */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>다가오는 행사</span>
          </h2>
          <Link
            to="/admin/events"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/admin/events/${event.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{event.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    event.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {event.status === 'active' ? '진행중' : '예정'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.time}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.reservations / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 ml-3">
                  {event.reservations}/{event.capacity}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 예약 */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>최근 예약</span>
          </h2>
          <Link
            to="/admin/reservations"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {recentReservations.map((reservation) => (
            <div key={reservation.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{reservation.userName}</p>
                <p className="text-xs text-gray-600">{reservation.eventName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">{reservation.time}</p>
                {reservation.status === 'confirmed' ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    확정
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-600">
                    <XCircle className="w-3 h-3" />
                    취소
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 빠른 액션 */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-gray-800 mb-3">빠른 작업</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/admin/events/new"
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition text-center"
          >
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">새 행사 등록</p>
          </Link>
          <Link
            to="/admin/stats"
            className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition text-center"
          >
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">상세 통계</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
