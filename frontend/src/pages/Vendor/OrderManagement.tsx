import { useState } from 'react'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Package,
  DollarSign,
  Filter,
  Bell,
} from 'lucide-react'

interface OrderItem {
  menuId: string
  menuName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: number
  userId: string
  userName: string
  userPhone: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  orderTime: string
  pickupTime?: string
  notes?: string
}

// TODO: 실제로는 API에서 가져올 데이터
const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 1,
    userId: 'user-1',
    userName: '김철수',
    userPhone: '010-1234-5678',
    items: [
      { menuId: 'menu-1', menuName: '치즈 떡볶이', quantity: 2, price: 5000 },
      { menuId: 'menu-3', menuName: '콜라', quantity: 2, price: 2000 },
    ],
    totalAmount: 14000,
    status: 'pending',
    orderTime: new Date().toISOString(),
    notes: '덜 맵게 해주세요',
  },
  {
    id: 'order-2',
    orderNumber: 2,
    userId: 'user-2',
    userName: '이영희',
    userPhone: '010-2345-6789',
    items: [
      { menuId: 'menu-2', menuName: '핫도그', quantity: 1, price: 3000 },
      { menuId: 'menu-3', menuName: '콜라', quantity: 1, price: 2000 },
    ],
    totalAmount: 5000,
    status: 'preparing',
    orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'order-3',
    orderNumber: 3,
    userId: 'user-3',
    userName: '박민수',
    userPhone: '010-3456-7890',
    items: [{ menuId: 'menu-4', menuName: '타코야키', quantity: 3, price: 4000 }],
    totalAmount: 12000,
    status: 'ready',
    orderTime: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'order-4',
    orderNumber: 4,
    userId: 'user-4',
    userName: '정수진',
    userPhone: '010-4567-8901',
    items: [
      { menuId: 'menu-1', menuName: '치즈 떡볶이', quantity: 1, price: 5000 },
      { menuId: 'menu-2', menuName: '핫도그', quantity: 1, price: 3000 },
    ],
    totalAmount: 8000,
    status: 'completed',
    orderTime: new Date(Date.now() - 30 * 60000).toISOString(),
    pickupTime: new Date(Date.now() - 20 * 60000).toISOString(),
  },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  >('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 필터링
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === 'all') return true
    return order.status === selectedStatus
  })

  // 상태별 정렬 (pending -> preparing -> ready -> completed -> cancelled)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const statusOrder = { pending: 1, preparing: 2, ready: 3, completed: 4, cancelled: 5 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  // 통계
  const stats = {
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    todayTotal: orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0),
  }

  // 주문 상태 변경
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus }
          if (newStatus === 'completed') {
            updatedOrder.pickupTime = new Date().toISOString()
          }
          return updatedOrder
        }
        return order
      })
    )

    // 알림 진동
    if ('vibrate' in navigator) {
      navigator.vibrate(100)
    }
  }

  // 주문 상세보기
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  // 시간 포맷
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffMinutes < 1) return '방금 전'
    if (diffMinutes < 60) return `${diffMinutes}분 전`
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const statusConfig = {
    pending: {
      label: '대기중',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: Clock,
      bgColor: 'bg-yellow-50',
    },
    preparing: {
      label: '조리중',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: Package,
      bgColor: 'bg-blue-50',
    },
    ready: {
      label: '완료',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
    },
    completed: {
      label: '픽업완료',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: CheckCircle,
      bgColor: 'bg-gray-50',
    },
    cancelled: {
      label: '취소',
      color: 'bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
      bgColor: 'bg-red-50',
    },
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">주문 관리</h1>
            <p className="text-green-100">실시간으로 주문을 확인하고 처리하세요</p>
          </div>
          <button className="relative">
            <Bell className="w-6 h-6" />
            {stats.pending > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {stats.pending}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="p-4 -mt-4">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600">대기</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
            <p className="text-xs text-gray-600">조리중</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
            <p className="text-xs text-gray-600">완료</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {(stats.todayTotal / 10000).toFixed(0)}만
            </p>
            <p className="text-xs text-gray-600">오늘매출</p>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'preparing', 'ready', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? '전체' : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="px-4 space-y-3">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">주문이 없습니다</p>
          </div>
        ) : (
          sortedOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <div
                key={order.id}
                className={`rounded-2xl shadow-sm overflow-hidden border-2 ${statusConfig[order.status].color}`}
                onClick={() => handleViewDetail(order)}
              >
                <div className={`p-4 ${statusConfig[order.status].bgColor}`}>
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-xl text-gray-900 shadow">
                        {order.orderNumber}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{order.userName}</h3>
                        <p className="text-xs text-gray-600">{formatTime(order.orderTime)}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
                        statusConfig[order.status].color
                      } bg-white`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig[order.status].label}
                    </span>
                  </div>

                  {/* 주문 항목 */}
                  <div className="bg-white rounded-xl p-3 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-900">
                          {item.menuName} x{item.quantity}
                        </span>
                        <span className="font-medium text-gray-700">
                          {(item.price * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold">
                      <span>총 금액</span>
                      <span className="text-green-600">{order.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>

                  {/* 메모 */}
                  {order.notes && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
                      <p className="text-sm text-orange-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{order.notes}</span>
                      </p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="grid grid-cols-2 gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(order.id, 'preparing')
                          }}
                          className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                          조리 시작
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('주문을 취소하시겠습니까?')) {
                              handleStatusChange(order.id, 'cancelled')
                            }
                          }}
                          className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                        >
                          주문 취소
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(order.id, 'ready')
                        }}
                        className="col-span-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                      >
                        조리 완료
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(order.id, 'completed')
                        }}
                        className="col-span-2 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition"
                      >
                        픽업 완료
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 주문 상세 모달 */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">주문 상세</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 주문 번호 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-3">
                  {selectedOrder.orderNumber}
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    statusConfig[selectedOrder.status].color
                  }`}
                >
                  {React.createElement(statusConfig[selectedOrder.status].icon, {
                    className: 'w-4 h-4',
                  })}
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>

              {/* 고객 정보 */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">고객 정보</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이름</span>
                    <span className="text-sm font-medium">{selectedOrder.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">전화번호</span>
                    <span className="text-sm font-medium">{selectedOrder.userPhone}</span>
                  </div>
                </div>
              </div>

              {/* 주문 정보 */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">주문 내역</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-900">
                        {item.menuName} x{item.quantity}
                      </span>
                      <span className="text-sm font-medium">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-300 flex justify-between">
                    <span className="font-bold">총 금액</span>
                    <span className="font-bold text-green-600 text-lg">
                      {selectedOrder.totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* 요청사항 */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">요청사항</h4>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-sm text-orange-900">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* 시간 정보 */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">시간 정보</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">주문 시간</span>
                    <span className="text-sm font-medium">
                      {new Date(selectedOrder.orderTime).toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.pickupTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">픽업 시간</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedOrder.pickupTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
