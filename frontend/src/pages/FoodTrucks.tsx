import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Star, Loader2 } from 'lucide-react'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'

const categories = ['전체', '한식', '양식', '일식', '중식', '디저트']

export default function FoodTrucks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  // API에서 푸드트럭 목록 가져오기
  const { data: foodTrucks, isLoading, error } = useFoodTrucks({
    category: selectedCategory === '전체' ? undefined : selectedCategory,
    isOpen: showOpenOnly || undefined,
  })

  // 검색 필터링 (프론트엔드에서 처리)
  const filteredTrucks = useMemo(() => {
    if (!foodTrucks) return []

    return foodTrucks.filter((truck) => {
      const matchesSearch =
        truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [foodTrucks, searchQuery])

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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😞</div>
            <p className="text-gray-500">푸드트럭 목록을 불러오는데 실패했습니다</p>
          </div>
        ) : filteredTrucks.length === 0 ? (
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
