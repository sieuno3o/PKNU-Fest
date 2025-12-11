import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCreateOrder } from '@/hooks/useOrders'
import CartItemCard, { type CartItem } from '@/components/cart/CartItemCard'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOrdering, setIsOrdering] = useState(false)
  const createOrderMutation = useCreateOrder()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const increaseQuantity = (id: string) => {
    saveCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
  }

  const decreaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id)
    if (item?.quantity === 1) {
      saveCart(cart.filter((i) => i.id !== id))
    } else {
      saveCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
    }
  }

  const removeItem = (id: string) => saveCart(cart.filter((item) => item.id !== id))
  const clearCart = () => saveCart([])

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.truckId]) acc[item.truckId] = { truckName: item.truckName, items: [] }
    acc[item.truckId].items.push(item)
    return acc
  }, {} as Record<string, { truckName: string; items: CartItem[] }>)

  const handleOrder = async () => {
    if (isOrdering) return
    const firstTruckId = Object.keys(groupedCart)[0]
    if (!firstTruckId) return
    setIsOrdering(true)
    try {
      const order = await createOrderMutation.mutateAsync({
        truckId: firstTruckId,
        items: cart.map((item) => ({ menuId: item.menuId, quantity: item.quantity })),
      })
      navigate(`/checkout?orderId=${order.id}&amount=${totalAmount}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      setIsOrdering(false)
    }
  }

  return (
    <div className="min-h-full bg-gray-50 pb-32">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">장바구니</h1>
        <p className="text-orange-100">담아둔 메뉴를 확인하고 주문하세요</p>
      </div>

      <div className="p-4">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">장바구니가 비어있어요</p>
            <button
              onClick={() => navigate('/foodtrucks')}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
            >
              푸드트럭 둘러보기
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium">
                전체 삭제
              </button>
            </div>
            <div className="space-y-6">
              {Object.entries(groupedCart).map(([truckId, { truckName, items }]) => (
                <div key={truckId} className="bg-white rounded-2xl p-4">
                  <h3 className="font-bold text-lg mb-4">{truckName}</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">총 {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
              <span className="text-2xl font-bold text-orange-600">{totalAmount.toLocaleString()}원</span>
            </div>
            <button
              onClick={handleOrder}
              disabled={isOrdering}
              className={`w-full py-4 rounded-2xl font-bold transition ${isOrdering ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
            >
              {isOrdering ? '주문 생성 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
