import { Clock, CheckCircle, XCircle, Package, AlertCircle, HelpCircle } from 'lucide-react'
import type { Order } from '@/lib/api/orders'

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: 'preparing' | 'ready' | 'completed' | 'cancelled' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED') => void
  onClick: () => void
}

const statusConfig: Record<string, { label: string; color: string; icon: any; bgColor: string }> = {
  pending: {
    label: '대기중',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: Clock,
    bgColor: 'bg-yellow-50',
  },
  PENDING: {
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
  PREPARING: {
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
  READY: {
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
  COMPLETED: {
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
  CANCELLED: {
    label: '취소',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: XCircle,
    bgColor: 'bg-red-50',
  },
}

const defaultStatus = {
  label: '알 수 없음',
  color: 'bg-gray-100 text-gray-700 border-gray-300',
  icon: HelpCircle,
  bgColor: 'bg-gray-50',
}

const formatTime = (isoString?: string) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export default function OrderCard({ order, onStatusChange, onClick }: OrderCardProps) {
  const config = statusConfig[order.status] || defaultStatus
  const StatusIcon = config.icon
  const orderItems = order.orderItems || order.items || []
  const totalAmount = order.totalPrice || order.totalAmount || 0
  const orderTime = order.orderTime || order.createdAt

  return (
    <div
      className={`rounded-2xl shadow-sm overflow-hidden border-2 ${config.color}`}
      onClick={onClick}
    >
      <div className={`p-4 ${config.bgColor}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-xl text-gray-900 shadow">
              {order.pickupNumber || order.orderNumber || order.id.slice(0, 4)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{order.userName || '고객'}</h3>
              <p className="text-xs text-gray-600">{formatTime(orderTime)}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${config.color} bg-white`}
          >
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </span>
        </div>

        {/* 주문 항목 */}
        <div className="bg-white rounded-xl p-3 mb-3">
          {orderItems.map((item, index) => (
            <div key={item.id || index} className="flex justify-between text-sm mb-1">
              <span className="text-gray-900">
                {item.menuItem?.name || item.menuName || '메뉴'} x{item.quantity}
              </span>
              <span className="font-medium text-gray-700">
                {((item.price || 0) * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold">
            <span>총 금액</span>
            <span className="text-green-600">{totalAmount.toLocaleString()}원</span>
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
          {(order.status === 'pending' || order.status === 'PENDING') && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(order.id, 'PREPARING')
                }}
                className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                조리 시작
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('주문을 취소하시겠습니까?')) {
                    onStatusChange(order.id, 'CANCELLED')
                  }
                }}
                className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                주문 취소
              </button>
            </>
          )}
          {(order.status === 'preparing' || order.status === 'PREPARING') && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange(order.id, 'READY')
              }}
              className="col-span-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
            >
              조리 완료
            </button>
          )}
          {(order.status === 'ready' || order.status === 'READY') && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange(order.id, 'COMPLETED')
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
}
