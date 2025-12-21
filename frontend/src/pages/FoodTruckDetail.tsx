import { useState } from 'react'
import type { Menu } from '@/lib/api/foodtrucks'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, X, ShoppingCart } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useFoodTruck } from '@/hooks/useFoodTrucks'

export default function FoodTruckDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  // 실제 API에서 푸드트럭 데이터 가져오기
  const { data: foodTruck, isLoading, error } = useFoodTruck(id!)

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error || !foodTruck) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">푸드트럭 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate('/foodtrucks')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 메뉴 선택 모달
  const handleMenuClick = (menuItem: Menu) => {
    setSelectedMenu(menuItem)
  }

  // 장바구니에 담기
  const addToCart = () => {
    if (!selectedMenu || !foodTruck) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: any) =>
        item.truckId === foodTruck.id && item.menuId === selectedMenu.id
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: `${foodTruck.id}-${selectedMenu.id}-${Date.now()}`,
        truckId: foodTruck.id,
        truckName: foodTruck.name,
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        price: selectedMenu.price,
        quantity: 1,
        image: selectedMenu.imageUrl,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    // Header 업데이트를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'))
    setSelectedMenu(null)

    // 토스트 알림
    toast.success('장바구니에 추가되었습니다!')
  }

  // 바로 결제하기 - 장바구니에 담고 결제 페이지로 이동
  const buyNow = () => {
    if (!selectedMenu || !foodTruck) return

    // 장바구니에 추가
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: any) =>
        item.truckId === foodTruck.id && item.menuId === selectedMenu.id
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: `${foodTruck.id}-${selectedMenu.id}-${Date.now()}`,
        truckId: foodTruck.id,
        truckName: foodTruck.name,
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        price: selectedMenu.price,
        quantity: 1,
        image: selectedMenu.imageUrl,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    setSelectedMenu(null)

    // 장바구니 페이지로 이동
    navigate('/cart')
  }

  return (
    <div className="min-h-full bg-white pb-32">
      {/* 헤더 이미지 */}
      <div className="relative">
        <img
          src={foodTruck.imageUrl || 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800'}
          alt={foodTruck.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
          운영중
        </div>
      </div>

      {/* 푸드트럭 정보 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{foodTruck.name}</h1>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{foodTruck.description}</p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{foodTruck.location}</span>
          </div>
          {foodTruck.owner?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{foodTruck.owner.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">메뉴</h2>
        {foodTruck.menu && foodTruck.menu.length > 0 ? (
          <div className="space-y-4">
            {foodTruck.menu.map((menu) => (
              <div
                key={menu.id}
                className={`flex gap-4 p-4 bg-gray-50 rounded-2xl ${!menu.available && 'opacity-50'}`}
              >
                <img
                  src={menu.imageUrl || 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400'}
                  alt={menu.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{menu.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{menu.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      {menu.price.toLocaleString()}원
                    </span>
                    {menu.available ? (
                      <button
                        onClick={() => handleMenuClick(menu)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition"
                      >
                        선택
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">품절</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">등록된 메뉴가 없습니다.</p>
        )}
      </div>

      {/* 메뉴 선택 모달 (장바구니 담기 / 바로 결제하기) */}
      {selectedMenu && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setSelectedMenu(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMenu(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-2">{selectedMenu.name}</h3>
            <p className="text-lg text-orange-600 font-bold mb-6">
              {selectedMenu.price.toLocaleString()}원
            </p>

            <div className="space-y-3">
              <button
                onClick={addToCart}
                className="w-full py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                장바구니 담기
              </button>
              <button
                onClick={buyNow}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition"
              >
                바로 결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
