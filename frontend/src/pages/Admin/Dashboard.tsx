import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  QrCode,
  Settings,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

export default function AdminDashboard() {
  // TODO: 실제로는 API에서 가져올 통계 데이터
  const stats = {
    totalEvents: 24,
    activeEvents: 8,
    totalReservations: 1256,
    todayReservations: 89,
    pendingReservations: 12,
    checkInRate: 78,
  }

  const quickLinks = [
    {
      title: '대시보드',
      description: '통계 및 주요 지표',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      path: '/admin/home',
    },
    {
      title: '행사 관리',
      description: '행사 등록 및 수정',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      path: '/admin/events',
    },
    {
      title: '예약 관리',
      description: '예약 확인 및 관리',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      path: '/admin/reservations',
    },
    {
      title: 'QR 스캐너',
      description: '체크인 처리',
      icon: QrCode,
      color: 'from-orange-500 to-red-500',
      path: '/admin/qr-scanner',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'reservation',
      message: '김철수님이 아이유 콘서트를 예약했습니다',
      time: '방금 전',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'event',
      message: '새로운 행사가 등록되었습니다: 게임 대회',
      time: '5분 전',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'alert',
      message: '아이유 콘서트 좌석이 90% 이상 예약되었습니다',
      time: '10분 전',
      icon: AlertCircle,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">관리자 메뉴</h1>
            <p className="text-indigo-100 text-sm">PKNU 축제 통합 관리 시스템</p>
          </div>
          <Link
            to="/profile"
            className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition"
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* 주요 통계 요약 */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
              <p className="text-xs text-gray-600">진행중 행사</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.todayReservations}</p>
              <p className="text-xs text-gray-600">오늘 예약</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.checkInRate}%</p>
              <p className="text-xs text-gray-600">체크인율</p>
            </div>
          </div>
        </div>
      </div>

      {/* 대기중인 작업 */}
      {stats.pendingReservations > 0 && (
        <div className="px-4 mb-6">
          <Link
            to="/admin/reservations"
            className="block bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-orange-100">대기중인 예약</p>
                  <p className="text-2xl font-bold">{stats.pendingReservations}건</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        </div>
      )}

      {/* 빠른 링크 */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">관리 메뉴</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
              <p className="text-xs text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 전체 통계 보기 */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">전체 통계</h3>
              <p className="text-sm text-gray-400">축제 전체 현황</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">전체 행사</p>
              <p className="text-2xl font-bold">{stats.totalEvents}개</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">전체 예약</p>
              <p className="text-2xl font-bold">{stats.totalReservations}건</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
