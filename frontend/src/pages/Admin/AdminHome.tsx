import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import AdminHomeHeader from '@/components/admin/AdminHomeHeader'
import AdminStatsGrid from '@/components/admin/AdminStatsGrid'
import AdminQuickActions from '@/components/admin/AdminQuickActions'
import AdminAlerts from '@/components/admin/AdminAlerts'
import AdminNotificationSender from '@/components/admin/AdminNotificationSender'

interface ActivityItem {
  id: string
  type: 'reservation' | 'checkin'
  message: string
  time: string
}

export default function AdminHome() {
  // 통계 API
  const { data: stats } = useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/statistics')
      return response.data?.data || response.data
    },
  })

  // 최근 활동 API
  const { data: recentActivity = [] } = useQuery<ActivityItem[]>({
    queryKey: ['admin', 'recent-activity'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/statistics/recent-activity')
      return response.data?.data || response.data || []
    },
  })

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

  // 알림 데이터 (최근 활동에서 생성)
  const alerts = recentActivity.slice(0, 3).map((activity) => ({
    id: activity.id,
    type: activity.type === 'reservation' ? 'info' as const : 'warning' as const,
    message: activity.message,
    time: formatTime(activity.time),
  }))

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <AdminHomeHeader />
      <AdminStatsGrid
        eventCount={stats?.activeEvents || 0}
        reservationCount={stats?.todayReservations || 0}
        foodTruckCount={stats?.totalOrders || 0}
        todayCheckIns={stats?.checkInRate || 0}
      />
      <AdminAlerts alerts={alerts.length > 0 ? alerts : []} />
      <AdminQuickActions />

      {/* 알림 발송 섹션 */}
      <div id="notification-sender">
        <AdminNotificationSender />
      </div>
    </div>
  )
}
