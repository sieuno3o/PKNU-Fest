import React from 'react'
import { Clock, CheckCircle, XCircle, Package, HelpCircle } from 'lucide-react'
import type { Order } from '@/lib/api/orders'

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PENDING: { label: '대기중', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  preparing: { label: '조리중', color: 'bg-blue-100 text-blue-700', icon: Package },
  PREPARING: { label: '조리중', color: 'bg-blue-100 text-blue-700', icon: Package },
  ready: { label: '완료', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  READY: { label: '완료', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  completed: { label: '픽업완료', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  COMPLETED: { label: '픽업완료', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELLED: { label: '취소', color: 'bg-red-100 text-red-700', icon: XCircle },
}

const defaultStatus = { label: '알 수 없음', color: 'bg-gray-100 text-gray-700', icon: HelpCircle }

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const config = statusConfig[order.status] || defaultStatus
  const orderItems = order.orderItems || order.items || []
  const totalAmount = order.totalPrice || order.totalAmount || 0
  const orderTime = order.orderTime || order.createdAt

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">주문 상세</h3>
            <button
              onClick={onClose}
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
              {order.pickupNumber || order.orderNumber || order.id.slice(0, 4)}
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${config.color}`}
            >
              {React.createElement(config.icon, {
                className: 'w-4 h-4',
              })}
              {config.label}
            </span>
          </div>

          {/* 고객 정보 */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">고객 정보</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">이름</span>
                <span className="text-sm font-medium">{order.userName || '고객'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">전화번호</span>
                <span className="text-sm font-medium">{order.userPhone || '-'}</span>
              </div>
            </div>
          </div>

          {/* 주문 정보 */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">주문 내역</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {orderItems.map((item, index) => (
                <div key={item.id || index} className="flex justify-between">
                  <span className="text-sm text-gray-900">
                    {item.menuItem?.name || item.menuName || '메뉴'} x{item.quantity}
                  </span>
                  <span className="text-sm font-medium">
                    {((item.price || 0) * item.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-300 flex justify-between">
                <span className="font-bold">총 금액</span>
                <span className="font-bold text-green-600 text-lg">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 요청사항 */}
          {order.notes && (
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">요청사항</h4>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-900">{order.notes}</p>
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
                  {orderTime ? new Date(orderTime).toLocaleString() : '-'}
                </span>
              </div>
              {order.pickupTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">픽업 시간</span>
                  <span className="text-sm font-medium">
                    {new Date(order.pickupTime).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
