import { useEvents } from '@/hooks/useEvents'
import { useAllReservations } from '@/hooks/useReservations'
import AdminHomeHeader from '@/components/admin/AdminHomeHeader'
import AdminStatsGrid from '@/components/admin/AdminStatsGrid'
import AdminQuickActions from '@/components/admin/AdminQuickActions'
import AdminAlerts from '@/components/admin/AdminAlerts'

export default function AdminHome() {
  const { data: events = [] } = useEvents()
  const { data: reservations = [] } = useAllReservations()

  // 통계 계산
  const ongoingEvents = events.filter(e => e.status === 'ongoing').length
  const todayReservations = reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0]
    return r.eventDate === today
  }).length
  const todayCheckIns = reservations.filter(r => r.status === 'checked-in').length

  // 알림 데이터
  const alerts = [
    {
      id: '1',
      type: 'warning' as const,
      message: '아이유 콘서트 예약이 80%를 초과했습니다',
      time: '10분 전',
    },
    {
      id: '2',
      type: 'info' as const,
      message: '새로운 푸드트럭 승인 요청이 3건 있습니다',
      time: '1시간 전',
    },
  ]

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <AdminHomeHeader />
      <AdminStatsGrid
        eventCount={ongoingEvents || 8}
        reservationCount={todayReservations || 156}
        foodTruckCount={12}
        todayCheckIns={todayCheckIns || 89}
      />
      <AdminAlerts alerts={alerts} />
      <AdminQuickActions />
    </div>
  )
}
