import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data: order, isLoading } = useOrder(orderId || '')

  if (!orderId) {
    navigate('/')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 pb-32">
      {/* 성공 아이콘 */}
      <div className="bg-white pt-12 pb-8">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">결제 완료!</h1>
        <p className="text-gray-600 text-center">주문이 접수되었습니다</p>
      </div>

      <div className="p-4 space-y-4">
        {/* 주문 정보 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">주문 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">주문 번호</span>
              <span className="font-semibold">{order?.pickupNumber || orderId.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">푸드트럭</span>
              <span className="font-semibold">{order?.foodTruck?.name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-bold text-orange-600">
                {order?.totalAmount?.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 수단</span>
              <span className="font-semibold">
                {order?.paymentMethod === 'CARD'
                  ? '카드 결제'
                  : order?.paymentMethod === 'KAKAO_PAY'
                    ? '카카오페이'
                    : order?.paymentMethod === 'TOSS_PAY'
                      ? '토스페이'
                      : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold mb-2">다음 단계</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. 주문이 접수되면 푸시 알림을 받습니다</li>
            <li>2. 조리가 시작되면 알림을 보내드립니다</li>
            <li>3. 준비가 완료되면 픽업하러 오세요!</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => {
              // 장바구니 비우기
              localStorage.removeItem('cart')
              window.dispatchEvent(new Event('cartUpdated'))
              navigate('/')
            }}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
