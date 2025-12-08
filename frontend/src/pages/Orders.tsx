import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useMyOrders } from '@/hooks/useOrders'

const statusConfig = {
  pending: {
    label: '주문 접수',
    color: 'bg-yellow-100 text-yellow-700',
    description: '주문이 접수되었어요',
  },
  preparing: {
    label: '준비중',
    color: 'bg-blue-100 text-blue-700',
    description: '주문을 준비하고 있어요',
  },
  ready: {
    label: '픽업 대기',
    color: 'bg-green-100 text-green-700',
    description: '주문이 준비되었어요! 픽업해가세요',
  },
  completed: {
    label: '완료',
    color: 'bg-gray-100 text-gray-700',
    description: '픽업 완료',
  },
  cancelled: {
    label: '취소',
    color: 'bg-red-100 text-red-700',
    description: '주문이 취소되었어요',
  },
}

export default function Orders() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // API에서 주문 목록 가져오기
  const { data: orders, isLoading, error } = useMyOrders()

  // 필터링
  const filteredOrders = useMemo(() => {
    if (!orders) return []

    return orders.filter((order) => {
      if (filter === 'active') {
        return order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
      }
      if (filter === 'completed') {
        return order.status === 'completed' || order.status === 'cancelled'
      }
      return true
    })
  }, [orders, filter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${month}/${day} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">주문 내역</h1>
        <p className="text-orange-100">내 푸드트럭 주문 내역을 확인하세요</p>
      </div>

      {/* 필터 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${filter === 'active'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            진행중
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${filter === 'completed'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            완료
          </button>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="p-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😞</div>
            <p className="text-gray-500">주문 내역을 불러오는데 실패했습니다</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500">주문 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{order.foodTruck?.name || '푸드트럭'}</h3>
                    <span className="text-sm text-gray-500">픽업번호: {order.pickupNumber || order.id.slice(0, 8)}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                  </span>
                </div>

                {/* 주문 항목 */}
                <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {item.menuItem?.name || '메뉴'} x {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  )) || []}
                </div>

                {/* 총 금액 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">총 결제금액</span>
                  <span className="text-lg font-bold text-orange-600">
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>

                {/* 시간 정보 */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>주문: {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 상태 설명 */}
                {(order.status === 'pending' || order.status === 'preparing' || order.status === 'ready') && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-sm font-medium ${order.status === 'ready'
                        ? 'bg-green-50 text-green-700'
                        : order.status === 'preparing'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                  >
                    {statusConfig[order.status]?.description || '주문 처리 중'}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
