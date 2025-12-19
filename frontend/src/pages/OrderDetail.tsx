import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'

const statusConfig = {
    pending: { label: '주문 접수', color: 'bg-yellow-100 text-yellow-700', description: '주문이 접수되었어요' },
    preparing: { label: '준비중', color: 'bg-blue-100 text-blue-700', description: '주문을 준비하고 있어요' },
    ready: { label: '픽업 대기', color: 'bg-green-100 text-green-700', description: '주문이 준비되었어요! 픽업해가세요' },
    completed: { label: '완료', color: 'bg-gray-100 text-gray-700', description: '픽업 완료' },
    cancelled: { label: '취소', color: 'bg-red-100 text-red-700', description: '주문이 취소되었어요' },
    PENDING: { label: '주문 접수', color: 'bg-yellow-100 text-yellow-700', description: '주문이 접수되었어요' },
    PREPARING: { label: '준비중', color: 'bg-blue-100 text-blue-700', description: '주문을 준비하고 있어요' },
    READY: { label: '픽업 대기', color: 'bg-green-100 text-green-700', description: '주문이 준비되었어요! 픽업해가세요' },
    COMPLETED: { label: '완료', color: 'bg-gray-100 text-gray-700', description: '픽업 완료' },
    CANCELLED: { label: '취소', color: 'bg-red-100 text-red-700', description: '주문이 취소되었어요' },
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function OrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: order, isLoading, error } = useOrder(id || '')

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">주문 정보를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-red-600 mb-4">주문 정보를 불러올 수 없습니다.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        주문 목록으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    const config = statusConfig[order.status as keyof typeof statusConfig]
    const orderItems = order.orderItems || order.items || []
    const totalAmount = order.totalPrice || order.totalAmount || 0

    return (
        <div className="min-h-full bg-gray-50 pb-32">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>뒤로</span>
                </button>
                <h1 className="text-2xl font-bold mb-2">주문 상세</h1>
                <p className="text-orange-100">픽업번호: {order.pickupNumber || order.id.slice(0, 8)}</p>
            </div>

            <div className="p-4 space-y-4">
                {/* 상태 카드 */}
                <div className={`rounded-2xl p-6 ${order.status === 'ready' || order.status === 'READY' ? 'bg-green-50' : order.status === 'preparing' || order.status === 'PREPARING' ? 'bg-blue-50' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${config?.color || 'bg-gray-100 text-gray-700'}`}>
                            {config?.label || order.status}
                        </span>
                        {(order.status === 'ready' || order.status === 'READY') && (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        )}
                    </div>
                    <p className="text-gray-700 font-medium">{config?.description}</p>
                </div>

                {/* 푸드트럭 정보 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg mb-4">푸드트럭 정보</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{order.foodTruck?.name || '푸드트럭'}</h3>
                                {order.foodTruck?.location && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {order.foodTruck.location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 주문 메뉴 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg mb-4">주문 메뉴</h2>
                    <div className="space-y-3">
                        {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <span className="font-medium text-gray-900">{item.menuItem?.name || '메뉴'}</span>
                                    <span className="text-gray-500 ml-2">x {item.quantity}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{((item.price || 0) * item.quantity).toLocaleString()}원</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-bold text-gray-900">총 결제금액</span>
                        <span className="text-xl font-bold text-orange-600">{totalAmount.toLocaleString()}원</span>
                    </div>
                </div>

                {/* 주문 정보 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg mb-4">주문 정보</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">주문 번호</span>
                            <span className="font-medium text-gray-900">{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">주문 시간</span>
                            <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                        </div>
                        {order.paymentMethod && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">결제 수단</span>
                                <span className="font-medium text-gray-900">
                                    {order.paymentMethod === 'CARD' ? '카드 결제' :
                                        order.paymentMethod === 'KAKAO_PAY' ? '카카오페이' :
                                            order.paymentMethod === 'TOSS_PAY' ? '토스페이' : order.paymentMethod}
                                </span>
                            </div>
                        )}
                        {order.paymentStatus && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">결제 상태</span>
                                <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {order.paymentStatus === 'PAID' ? '결제 완료' :
                                        order.paymentStatus === 'PENDING' ? '결제 대기' :
                                            order.paymentStatus === 'CANCELLED' ? '결제 취소' : order.paymentStatus}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 버튼 */}
                <button
                    onClick={() => navigate('/orders')}
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                >
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    )
}
