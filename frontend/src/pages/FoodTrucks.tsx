import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useFoodTrucks } from '@/hooks/useFoodTrucks'

export default function FoodTrucks() {
  const [searchQuery, setSearchQuery] = useState('')

  // API에서 푸드트럭 목록 가져오기
  const { data: foodTrucks, isLoading, error } = useFoodTrucks({})

  // 검색 필터링 (프론트엔드에서 처리)
  const filteredTrucks = useMemo(() => {
    if (!foodTrucks) return []

    return foodTrucks.filter((truck) => {
      const matchesSearch =
        truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (truck.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
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
                      src={truck.imageUrl || 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400'}
                      alt={truck.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{truck.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{truck.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{truck.location}</span>
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

