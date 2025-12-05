import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  truckId: string
  truckName: string
  menuId: string
  menuName: string
  price: number
  quantity: number
  image: string
}

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])

  // 장바구니 불러오기
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // 장바구니 저장
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    // Header 업데이트를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'))
  }

  // 수량 증가
  const increaseQuantity = (id: string) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
    saveCart(newCart)
  }

  // 수량 감소
  const decreaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id)
    if (item && item.quantity === 1) {
      removeItem(id)
    } else {
      const newCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      saveCart(newCart)
    }
  }

  // 아이템 제거
  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id)
    saveCart(newCart)
  }

  // 전체 삭제
  const clearCart = () => {
    saveCart([])
  }

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 푸드트럭별로 그룹화
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.truckId]) {
      acc[item.truckId] = {
        truckName: item.truckName,
        items: [],
      }
    }
    acc[item.truckId].items.push(item)
    return acc
  }, {} as Record<string, { truckName: string; items: CartItem[] }>)

  return (
    <div className="min-h-full bg-gray-50 pb-32">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">장바구니</h1>
        <p className="text-orange-100">담아둔 메뉴를 확인하고 주문하세요</p>
      </div>

      {/* 장바구니 내용 */}
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
            {/* 전체 삭제 버튼 */}
            <div className="flex justify-end mb-4">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                전체 삭제
              </button>
            </div>

            {/* 푸드트럭별로 표시 */}
            <div className="space-y-6">
              {Object.entries(groupedCart).map(([truckId, { truckName, items }]) => (
                <div key={truckId} className="bg-white rounded-2xl p-4">
                  <h3 className="font-bold text-lg mb-4">{truckName}</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.menuName}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.menuName}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.price.toLocaleString()}원
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {(item.price * item.quantity).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 하단 결제 바 */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">
                총 {cart.reduce((sum, item) => sum + item.quantity, 0)}개
              </span>
              <span className="text-2xl font-bold text-orange-600">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={() => {
                alert('주문이 완료되었습니다!')
                clearCart()
                navigate('/orders')
              }}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition"
            >
              {totalAmount.toLocaleString()}원 결제하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
