import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, MapPin, Clock, Users, GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'

const categories = ['전체', '공연', '체험', '게임', '토크', '기타']

// 카테고리별 색상 매핑
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    '공연': 'from-pink-500 to-purple-600',
    '체험': 'from-orange-500 to-red-600',
    '게임': 'from-blue-500 to-cyan-600',
    '토크': 'from-indigo-500 to-purple-600',
    '기타': 'from-green-500 to-emerald-600',
  }
  return colors[category] || 'from-gray-500 to-gray-600'
}

// 카테고리별 이모지 매핑
const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    '공연': '🎵',
    '체험': '🎨',
    '게임': '🎮',
    '토크': '💬',
    '기타': '🎪',
  }
  return emojis[category] || '🎪'
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showStudentOnly, setShowStudentOnly] = useState(false)

  // API에서 이벤트 데이터 가져오기
  const { data: events, isLoading, error } = useEvents({
    category: selectedCategory !== '전체' ? selectedCategory : undefined,
    search: searchQuery || undefined,
    requiresStudentVerification: showStudentOnly || undefined,
  })

  // 필터링된 이벤트 (클라이언트 사이드 추가 필터링)
  const filteredEvents = useMemo(() => {
    if (!events) return []

    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === '전체' || event.category === selectedCategory
      const matchesStudentFilter = !showStudentOnly || event.requiresStudentVerification
      return matchesSearch && matchesCategory && matchesStudentFilter
    })
  }, [events, searchQuery, selectedCategory, showStudentOnly])

  return (
    <div className="pb-4">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">행사 목록</h1>
        <p className="text-blue-100">PKNU 2025 봄 축제 전체 프로그램</p>
      </div>

      {/* 검색 바 */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="행사 검색..."
          />
        </div>
      </div>

      {/* 필터 */}
      <div className="px-4 py-4 bg-white border-b">
        {/* 카테고리 필터 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">카테고리</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 학생 전용 필터 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">학생 전용만 보기</span>
          </div>
          <button
            onClick={() => setShowStudentOnly(!showStudentOnly)}
            className={`relative w-12 h-6 rounded-full transition ${
              showStudentOnly ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showStudentOnly ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 결과 카운트 */}
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-blue-600">{filteredEvents.length}</span>개의 행사
        </p>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="mx-4 my-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">데이터를 불러올 수 없습니다</h3>
              <p className="text-sm text-red-800">
                {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 행사 카드 리스트 */}
      {!isLoading && !error && (
        <div className="px-4 py-4 space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const reservationPercentage = event.capacity
                ? (event.currentReservations / event.capacity) * 100
                : 0

              return (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* 썸네일 */}
                  <div className={`relative h-40 bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center`}>
                    {event.requiresStudentVerification && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600">학생 전용</span>
                      </div>
                    )}
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-white text-6xl">
                        {getCategoryEmoji(event.category)}
                      </div>
                    )}
                  </div>

                  {/* 카드 내용 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded mb-2">
                          {event.category}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* 예약 현황 */}
                    {event.capacity && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>예약 현황</span>
                          </div>
                          <span className="font-semibold">
                            {event.currentReservations}/{event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              reservationPercentage > 80
                                ? 'bg-red-500'
                                : reservationPercentage > 50
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${reservationPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
