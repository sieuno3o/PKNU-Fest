import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Star, Phone, X, ShoppingCart } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

// TODO: 나중에 API에서 가져올 데이터
const mockFoodTruck = {
  id: '1',
  name: '타코야끼 트럭',
  description: '일본 정통 타코야끼와 오코노미야키를 판매합니다. 신선한 재료로 매일 아침 직접 만든 반죽을 사용합니다.',
  category: '일식',
  image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800',
  location: '대운동장 앞',
  operatingHours: '10:00 - 22:00',
  rating: 4.8,
  reviewCount: 127,
  phone: '010-1234-5678',
  isOpen: true,
  menu: [
    {
      id: 'm1',
      name: '타코야끼 (6개)',
      description: '문어가 들어간 일본식 타코야끼',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
      isAvailable: true,
    },
    {
      id: 'm2',
      name: '타코야끼 (10개)',
      description: '문어가 들어간 일본식 타코야끼',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
      isAvailable: true,
    },
    {
      id: 'm3',
      name: '오코노미야키',
      description: '야채와 해산물이 듬뿍 들어간 일본식 팬케이크',
      price: 7000,
      image: 'https://images.unsplash.com/photo-1618128782653-23f52ac91459?w=400',
      isAvailable: true,
    },
    {
      id: 'm4',
      name: '치즈 타코야끼 (6개)',
      description: '치즈가 듬뿍 들어간 타코야끼',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
      isAvailable: false,
    },
  ],
}

export default function FoodTruckDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState<typeof mockFoodTruck.menu[0] | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // 메뉴 선택 모달
  const handleMenuClick = (menu: typeof mockFoodTruck.menu[0]) => {
    setSelectedMenu(menu)
  }

  // 장바구니에 담기
  const addToCart = () => {
    if (!selectedMenu) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: any) =>
        item.truckId === mockFoodTruck.id && item.menuId === selectedMenu.id
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: `${mockFoodTruck.id}-${selectedMenu.id}-${Date.now()}`,
        truckId: mockFoodTruck.id,
        truckName: mockFoodTruck.name,
        menuId: selectedMenu.id,
        menuName: selectedMenu.name,
        price: selectedMenu.price,
        quantity: 1,
        image: selectedMenu.image,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    // Header 업데이트를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'))
    setSelectedMenu(null)

    // 토스트 알림
    toast.success('장바구니에 추가되었습니다!')
  }

  // 바로 결제하기
  const buyNow = () => {
    setSelectedMenu(null)
    setShowOrderModal(true)
  }

  return (
    <div className="min-h-full bg-white pb-32">
      {/* 헤더 이미지 */}
      <div className="relative">
        <img
          src={mockFoodTruck.image}
          alt={mockFoodTruck.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {mockFoodTruck.isOpen && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
            운영중
          </div>
        )}
      </div>

      {/* 푸드트럭 정보 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockFoodTruck.name}</h1>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg">
              {mockFoodTruck.category}
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-lg font-bold">{mockFoodTruck.rating}</span>
            <span className="text-sm text-gray-500">({mockFoodTruck.reviewCount})</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{mockFoodTruck.description}</p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{mockFoodTruck.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{mockFoodTruck.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{mockFoodTruck.phone}</span>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">메뉴</h2>
        <div className="space-y-4">
          {mockFoodTruck.menu.map((menu) => (
            <div
              key={menu.id}
              className={`flex gap-4 p-4 bg-gray-50 rounded-2xl ${
                !menu.isAvailable && 'opacity-50'
              }`}
            >
              <img
                src={menu.image}
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
                  {menu.isAvailable ? (
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
      </div>

      {/* 메뉴 선택 모달 (장바구니 담기 / 바로 결제하기) */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6">
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

      {/* 바로 결제 모달 */}
      {showOrderModal && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">주문 확인</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900">{selectedMenu.name}</h4>
              <p className="text-sm text-gray-600">{selectedMenu.price.toLocaleString()}원</p>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-orange-600">{selectedMenu.price.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('주문이 완료되었습니다!')
                setShowOrderModal(false)
                setSelectedMenu(null)
                navigate('/orders')
              }}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition"
            >
              {selectedMenu.price.toLocaleString()}원 결제하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
