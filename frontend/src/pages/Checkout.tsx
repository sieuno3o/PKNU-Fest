import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CreditCard, Smartphone, Check } from 'lucide-react'
import { useCreateOrder, useProcessPayment } from '@/hooks/useOrders'
import type { PaymentMethod } from '@/types'

interface CartItem {
  truckId: string
  truckName: string
  menuId: string
  menuName: string
  price: number
  quantity: number
}

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const truckId = searchParams.get('truckId')
  const totalAmount = Number(searchParams.get('amount') || 0)

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | ''>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])

  const createOrderMutation = useCreateOrder()
  const processPaymentMutation = useProcessPayment()

  // 장바구니 데이터 로드
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  if (!truckId) {
    navigate('/cart')
    return null
  }

  const paymentMethods = [
    {
      id: 'CARD' as PaymentMethod,
      name: '카드 결제',
      icon: CreditCard,
      description: '신용/체크카드',
    },
    {
      id: 'KAKAO_PAY' as PaymentMethod,
      name: '카카오페이',
      icon: Smartphone,
      description: '간편 결제',
    },
    {
      id: 'TOSS_PAY' as PaymentMethod,
      name: '토스페이',
      icon: Smartphone,
      description: '간편 결제',
    },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('결제 수단을 선택해주세요')
      return
    }

    if (cart.length === 0) {
      alert('장바구니가 비어있습니다')
      navigate('/cart')
      return
    }

    setIsProcessing(true)

    try {
      // 1. 주문 생성 (결제 시점에!)
      const order = await createOrderMutation.mutateAsync({
        foodTruckId: truckId,
        items: cart.map((item) => ({ menuItemId: item.menuId, quantity: item.quantity })),
      })

      if (!order?.id) {
        throw new Error('주문 생성 실패')
      }

      // 2. 결제 처리
      await processPaymentMutation.mutateAsync({
        orderId: order.id,
        data: { paymentMethod: selectedMethod },
      })

      // 3. 장바구니 비우기
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))

      // 4. 결제 성공 페이지로 이동
      navigate(`/payment/success?orderId=${order.id}`)
    } catch (error) {
      console.error('Payment error:', error)
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-full bg-gray-50 pb-32">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">결제하기</h1>
        <p className="text-orange-100">결제 수단을 선택해주세요</p>
      </div>

      <div className="p-4 space-y-4">
        {/* 주문 금액 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">총 결제금액</span>
            <span className="text-2xl font-bold text-orange-600">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">결제 수단</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${selectedMethod === method.id
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <method.icon
                    className={`w-6 h-6 ${selectedMethod === method.id ? 'text-orange-600' : 'text-gray-400'
                      }`}
                  />
                  <div className="text-left">
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <Check className="w-6 h-6 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 결제 안내 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>테스트 모드:</strong> 실제 결제가 진행되지 않습니다. 결제 시뮬레이션만
            수행됩니다.
          </p>
        </div>

        {/* 결제 버튼 */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white transition ${!selectedMethod || isProcessing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
              }`}
          >
            {isProcessing ? '결제 처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  )
}
