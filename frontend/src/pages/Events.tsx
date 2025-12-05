import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, MapPin, Clock, Users, GraduationCap } from 'lucide-react'

// TODO: 나중에 API에서 가져올 데이터
const mockEvents = [
  {
    id: '1',
    title: '아이유 콘서트',
    category: '공연',
    date: '2025-05-13',
    time: '19:00',
    location: '대운동장',
    capacity: 5000,
    reserved: 3500,
    isStudentOnly: false,
    thumbnail: null,
    status: 'PUBLISHED',
    color: 'from-pink-500 to-purple-600',
  },
  {
    id: '2',
    title: '체험 부스 - AR/VR',
    category: '체험',
    date: '2025-05-13',
    time: '10:00',
    location: '학생회관 1층',
    capacity: 50,
    reserved: 25,
    isStudentOnly: true,
    thumbnail: null,
    status: 'PUBLISHED',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: '3',
    title: '게임 대회',
    category: '게임',
    date: '2025-05-14',
    time: '14:00',
    location: '대강당',
    capacity: 200,
    reserved: 180,
    isStudentOnly: false,
    thumbnail: null,
    status: 'PUBLISHED',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: '4',
    title: '프리마켓',
    category: '기타',
    date: '2025-05-14',
    time: '11:00',
    location: '잔디광장',
    capacity: null,
    reserved: 0,
    isStudentOnly: false,
    thumbnail: null,
    status: 'PUBLISHED',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: '5',
    title: '학생 토크콘서트',
    category: '토크',
    date: '2025-05-15',
    time: '16:00',
    location: '소극장',
    capacity: 150,
    reserved: 45,
    isStudentOnly: true,
    thumbnail: null,
    status: 'PUBLISHED',
    color: 'from-indigo-500 to-purple-600',
  },
]

const categories = ['전체', '공연', '체험', '게임', '토크', '기타']

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showStudentOnly, setShowStudentOnly] = useState(false)

  // 필터링된 이벤트
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || event.category === selectedCategory
    const matchesStudentFilter = !showStudentOnly || event.isStudentOnly
    return matchesSearch && matchesCategory && matchesStudentFilter
  })

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

      {/* 행사 카드 리스트 */}
      <div className="px-4 py-4 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* 썸네일 */}
              <div className={`relative h-40 bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                {event.isStudentOnly && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">학생 전용</span>
                  </div>
                )}
                <div className="text-white text-6xl">
                  {event.category === '공연' ? '🎵' :
                   event.category === '체험' ? '🎨' :
                   event.category === '게임' ? '🎮' :
                   event.category === '토크' ? '💬' : '🎪'}
                </div>
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
                    <span>{event.time}</span>
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
                        {event.reserved}/{event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (event.reserved / event.capacity) * 100 > 80
                            ? 'bg-red-500'
                            : (event.reserved / event.capacity) * 100 > 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(event.reserved / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
