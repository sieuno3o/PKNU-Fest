import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import DashboardHeader from '@/components/vendor/DashboardHeader'
import DashboardStats from '@/components/vendor/DashboardStats'
import RealtimeOrderStatus from '@/components/vendor/RealtimeOrderStatus'
import DashboardQuickLinks from '@/components/vendor/DashboardQuickLinks'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  // 푸드트럭 ID
  const truckId = (user as any)?.foodTruckId || user?.id

  if (!truckId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">푸드트럭 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <DashboardHeader
        truckName="맛있는 푸드트럭"
        isOpen={isOpen}
        onToggleStatus={() => setIsOpen(!isOpen)}
      />

      <DashboardStats
        todayRevenue={850000}
        orderCount={42}
        pendingOrders={5}
        rating={4.8}
      />

      <RealtimeOrderStatus
        pendingCount={3}
        preparingCount={5}
        readyCount={12}
        onViewAll={() => navigate('/vendor/orders')}
      />

      <DashboardQuickLinks />
    </div>
  )
}
