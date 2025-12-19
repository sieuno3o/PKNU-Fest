import { Link } from 'react-router-dom'
import { Clock, ChevronRight } from 'lucide-react'
import type { Order } from '@/lib/api/orders'

const statusConfig = {
    pending: { label: '주문 접수', color: 'bg-yellow-100 text-yellow-700', description: '주문이 접수되었어요' },
    preparing: { label: '준비중', color: 'bg-blue-100 text-blue-700', description: '주문을 준비하고 있어요' },
    ready: { label: '픽업 대기', color: 'bg-green-100 text-green-700', description: '주문이 준비되었어요! 픽업해가세요' },
    completed: { label: '완료', color: 'bg-gray-100 text-gray-700', description: '픽업 완료' },
    cancelled: { label: '취소', color: 'bg-red-100 text-red-700', description: '주문이 취소되었어요' },
}

interface OrderCardProps {
    order: Order
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${month}/${day} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export default function OrderCard({ order }: OrderCardProps) {
    const config = statusConfig[order.status as keyof typeof statusConfig]

    return (
        <Link
            to={`/orders/${order.id}`}
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{order.foodTruck?.name || '푸드트럭'}</h3>
                    <span className="text-sm text-gray-500">픽업번호: {order.pickupNumber || order.id.slice(0, 8)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${config?.color || 'bg-gray-100 text-gray-700'}`}>
                    {config?.label || order.status}
                </span>
            </div>

            <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                {(order.orderItems || order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.menuItem?.name || '메뉴'} x {item.quantity}</span>
                        <span className="text-gray-900 font-medium">{((item.price || 0) * item.quantity).toLocaleString()}원</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">총 결제금액</span>
                <span className="text-lg font-bold text-orange-600">{(order.totalPrice || order.totalAmount || 0).toLocaleString()}원</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>주문: {formatDate(order.createdAt)}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
            </div>

            {(order.status === 'pending' || order.status === 'preparing' || order.status === 'ready') && (
                <div className={`mt-3 p-3 rounded-xl text-sm font-medium ${order.status === 'ready' ? 'bg-green-50 text-green-700' :
                    order.status === 'preparing' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                    {config?.description || '주문 처리 중'}
                </div>
            )}
        </Link>
    )
}
