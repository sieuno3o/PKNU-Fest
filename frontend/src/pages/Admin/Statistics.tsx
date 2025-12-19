import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Users,
    Star,
    Activity,
    ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface DailyTrend {
    date: string
    dayName: string
    reservations: number
}

interface CategoryStat {
    category: string
    count: number
}

interface PopularEvent {
    id: string
    title: string
    category: string
    reservationCount: number
    capacity: number
}

interface ActivityItem {
    id: string
    type: 'reservation' | 'checkin'
    message: string
    time: string
}

export default function Statistics() {
    // 기본 통계
    const { data: stats } = useQuery({
        queryKey: ['admin', 'statistics'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/statistics')
            return response.data?.data || response.data
        },
    })

    // 일간 예약 추이
    const { data: dailyTrend = [] } = useQuery<DailyTrend[]>({
        queryKey: ['admin', 'daily-trend'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/statistics/daily-trend')
            return response.data?.data || response.data || []
        },
    })

    // 카테고리별 통계
    const { data: categoryStats = [] } = useQuery<CategoryStat[]>({
        queryKey: ['admin', 'category-stats'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/statistics/categories')
            return response.data?.data || response.data || []
        },
    })

    // 인기 행사
    const { data: popularEvents = [] } = useQuery<PopularEvent[]>({
        queryKey: ['admin', 'popular-events'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/statistics/popular-events')
            return response.data?.data || response.data || []
        },
    })

    // 최근 활동
    const { data: recentActivity = [] } = useQuery<ActivityItem[]>({
        queryKey: ['admin', 'recent-activity'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/statistics/recent-activity')
            return response.data?.data || response.data || []
        },
    })

    // 일간 추이 최대값 (차트 스케일링용)
    const maxReservations = Math.max(...dailyTrend.map(d => d.reservations), 1)

    // 시간 포맷
    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return '방금 전'
        if (diffMins < 60) return `${diffMins}분 전`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`
        return `${Math.floor(diffMins / 1440)}일 전`
    }

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* 헤더 */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Link
                        to="/"
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">통계 리포트</h1>
                        <p className="text-indigo-100 text-sm">상세 통계 및 분석</p>
                    </div>
                </div>
            </div>

            {/* 요약 통계 */}
            <div className="px-4 -mt-6 mb-6">
                <div className="bg-white rounded-2xl shadow-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
                            <p className="text-xs text-gray-600">전체 행사</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalReservations || 0}</p>
                            <p className="text-xs text-gray-600">총 예약</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{stats?.checkInRate || 0}%</p>
                            <p className="text-xs text-gray-600">체크인율</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-xl">
                            <Activity className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{stats?.todayReservations || 0}</p>
                            <p className="text-xs text-gray-600">오늘 예약</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 일간 예약 추이 (간단한 막대 차트) */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-900">일간 예약 추이</h2>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-32">
                        {dailyTrend.map((day) => (
                            <div key={day.date} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex flex-col items-center justify-end h-24">
                                    <span className="text-xs text-gray-600 mb-1">{day.reservations}</span>
                                    <div
                                        className="w-full max-w-8 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all"
                                        style={{
                                            height: `${Math.max((day.reservations / maxReservations) * 80, 4)}px`,
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{day.dayName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 카테고리별 통계 */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">카테고리별 행사</h2>
                    </div>
                    <div className="space-y-3">
                        {categoryStats.map((cat, idx) => {
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                            const totalCount = categoryStats.reduce((sum, c) => sum + c.count, 0)
                            const percentage = totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0

                            return (
                                <div key={cat.category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{cat.category}</span>
                                        <span className="text-gray-500">{cat.count}개 ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[idx % colors.length]} rounded-full transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 인기 행사 순위 */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-lg font-bold text-gray-900">인기 행사 TOP 5</h2>
                    </div>
                    <div className="space-y-3">
                        {popularEvents.map((event, idx) => (
                            <div key={event.id} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-500' :
                                        idx === 1 ? 'bg-gray-400' :
                                            idx === 2 ? 'bg-orange-400' : 'bg-gray-300'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-indigo-600">{event.reservationCount}</p>
                                    <p className="text-xs text-gray-500">/{event.capacity}명</p>
                                </div>
                            </div>
                        ))}
                        {popularEvents.length === 0 && (
                            <p className="text-center text-gray-500 py-4">데이터가 없습니다</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 최근 활동 */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-900">최근 활동</h2>
                    </div>
                    <div className="space-y-3">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'reservation' ? 'bg-green-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">{activity.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatTime(activity.time)}</p>
                                </div>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <p className="text-center text-gray-500 py-4">최근 활동이 없습니다</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
