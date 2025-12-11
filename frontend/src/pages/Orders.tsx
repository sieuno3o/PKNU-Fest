import { useState, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useMyOrders } from '@/hooks/useOrders'
import OrderCard from '@/components/orders/OrderCard'

export default function Orders() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const { data: orders, isLoading, error } = useMyOrders()

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

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">주문 내역</h1>
        <p className="text-orange-100">내 푸드트럭 주문 내역을 확인하세요</p>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${filter === f ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {f === 'all' ? '전체' : f === 'active' ? '진행중' : '완료'}
            </button>
          ))}
        </div>
      </div>

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
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
