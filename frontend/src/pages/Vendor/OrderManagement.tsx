import { useState, useMemo } from 'react'
import { ShoppingBag, XCircle, Package, Loader2 } from 'lucide-react'
import { useVendorOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'
import { useAuth } from '@/hooks/useAuth'
import type { Order } from '@/lib/api/orders'
import OrderHeader from '@/components/vendor/OrderHeader'
import OrderStats from '@/components/vendor/OrderStats'
import OrderFilters from '@/components/vendor/OrderFilters'
import OrderCard from '@/components/vendor/OrderCard'
import OrderDetailModal from '@/components/vendor/OrderDetailModal'

type OrderStatus = 'all' | 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export default function OrderManagement() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Get vendor's food truck
  const { data: foodTrucks, isLoading: loadingTrucks } = useFoodTrucks()
  const vendorTruck = useMemo(
    () => foodTrucks?.find((truck) => truck.ownerId === user?.id),
    [foodTrucks, user?.id]
  )

  // Fetch orders for the vendor's truck
  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: ordersError,
  } = useVendorOrders(vendorTruck?.id || '', {
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  })

  // Update order status mutation
  const updateOrderStatus = useUpdateOrderStatus()

  const isLoading = loadingTrucks || loadingOrders

  // Normalize status to uppercase for comparison
  const normalizeStatus = (status: string) => status?.toUpperCase()

  // 필터링 및 정렬
  const sortedOrders = useMemo(() => {
    const statusOrder: Record<string, number> = {
      PENDING: 1, pending: 1,
      PREPARING: 2, preparing: 2,
      READY: 3, ready: 3,
      COMPLETED: 4, completed: 4,
      CANCELLED: 5, cancelled: 5
    }
    return [...orders].sort((a, b) => (statusOrder[a.status] || 6) - (statusOrder[b.status] || 6))
  }, [orders])

  // 통계
  const stats = useMemo(() => {
    return {
      pending: orders.filter((o) => normalizeStatus(o.status) === 'PENDING').length,
      preparing: orders.filter((o) => normalizeStatus(o.status) === 'PREPARING').length,
      ready: orders.filter((o) => normalizeStatus(o.status) === 'READY').length,
      todayTotal: orders
        .filter((o) => normalizeStatus(o.status) === 'COMPLETED')
        .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0),
    }
  }, [orders])

  // 주문 상태 변경
  const handleStatusChange = async (
    orderId: string,
    newStatus: 'preparing' | 'ready' | 'completed' | 'cancelled' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
  ) => {
    if (!vendorTruck) return

    try {
      await updateOrderStatus.mutateAsync({
        truckId: vendorTruck.id,
        orderId,
        data: { status: newStatus.toUpperCase() as any },
      })

      // 알림 진동
      if ('vibrate' in navigator) {
        navigator.vibrate(100)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  // 주문 상세보기
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-green-600 animate-spin" />
          <p className="text-gray-600">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (ordersError) {
    return (
      <div className="min-h-full bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600">주문 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  // No food truck found
  if (!vendorTruck) {
    return (
      <div className="min-h-full bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">푸드트럭 정보 없음</h2>
          <p className="text-gray-600">등록된 푸드트럭이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <OrderHeader pendingCount={stats.pending} />
      <OrderStats {...stats} />
      <OrderFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus as any} />

      {/* 주문 목록 */}
      <div className="px-4 space-y-3">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">주문이 없습니다</p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onClick={() => handleViewDetail(order)}
            />
          ))
        )}
      </div>

      {/* 주문 상세 모달 */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setShowDetailModal(false)} />
      )}
    </div>
  )
}
