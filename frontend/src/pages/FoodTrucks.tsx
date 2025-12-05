import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Star } from 'lucide-react'

// TODO: 나중에 API에서 가져올 데이터
const mockFoodTrucks = [
  {
    id: '1',
    name: '타코야끼 트럭',
    description: '일본 정통 타코야끼와 오코노미야키를 판매합니다',
    category: '일식',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500',
    location: '대운동장 앞',
    operatingHours: '10:00 - 22:00',
    rating: 4.8,
    reviewCount: 127,
    isOpen: true,
  },
  {
    id: '2',
    name: '햄버거 트럭',
    description: '수제 패티로 만든 프리미엄 햄버거',
    category: '양식',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    location: '중앙광장',
    operatingHours: '11:00 - 21:00',
    rating: 4.6,
    reviewCount: 95,
    isOpen: true,
  },
  {
    id: '3',
    name: '떡볶이 트럭',
    description: '매콤달콤한 즉석 떡볶이와 튀김',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500',
    location: '인문관 앞',
    operatingHours: '10:00 - 20:00',
    rating: 4.7,
    reviewCount: 203,
    isOpen: false,
  },
  {
    id: '4',
    name: '크레페 트럭',
    description: '달콤한 디저트 크레페',
    category: '디저트',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    location: '도서관 앞',
    operatingHours: '12:00 - 22:00',
    rating: 4.9,
    reviewCount: 156,
    isOpen: true,
  },
  {
    id: '5',
    name: '치킨 트럭',
    description: '바삭한 프라이드 치킨',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500',
    location: '대운동장',
    operatingHours: '11:00 - 23:00',
    rating: 4.5,
    reviewCount: 89,
    isOpen: true,
  },
]

const categories = ['전체', '한식', '양식', '일식', '중식', '디저트']

export default function FoodTrucks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  const filteredTrucks = mockFoodTrucks.filter((truck) => {
    const matchesSearch =
      truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || truck.category === selectedCategory
    const matchesOpenFilter = !showOpenOnly || truck.isOpen
    return matchesSearch && matchesCategory && matchesOpenFilter
  })

  return (
    <div className="min-h-full bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">푸드트럭</h1>
        <p className="text-orange-100">맛있는 음식을 한자리에서</p>
      </div>

      {/* 검색 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="푸드트럭 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 운영중만 보기 토글 */}
      <div className="px-4 pb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => setShowOpenOnly(e.target.checked)}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">운영중인 푸드트럭만 보기</span>
        </label>
      </div>

      {/* 푸드트럭 목록 */}
      <div className="px-4 pb-20">
        {filteredTrucks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍔</div>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrucks.map((truck) => (
              <Link
                key={truck.id}
                to={`/foodtrucks/${truck.id}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4 p-4">
                  {/* 이미지 */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={truck.image}
                      alt={truck.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    {truck.isOpen && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        운영중
                      </div>
                    )}
                    {!truck.isOpen && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                        종료
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{truck.name}</h3>
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">
                          {truck.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{truck.rating}</span>
                        <span className="text-xs text-gray-500">({truck.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{truck.description}</p>
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{truck.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{truck.operatingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
