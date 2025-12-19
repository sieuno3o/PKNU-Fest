import { useState } from 'react'
import { Search, Filter, MapPin, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEvents } from '@/hooks/useEvents'

// 부스 카테고리
const BOOTH_CATEGORIES = [
    { id: 'all', label: '전체', icon: '🎪' },
    { id: '게임', label: '게임', icon: '🎮' },
    { id: '매칭', label: '매칭', icon: '💕' },
    { id: '퀴즈', label: '퀴즈', icon: '❓' },
    { id: '체험', label: '체험', icon: '🎨' },
    { id: '음식', label: '음식', icon: '🍔' },
    { id: '포토', label: '포토', icon: '📸' },
]

// 파스텔 색상
const PASTEL_COLORS = {
    '게임': '#C4B5FD',
    '매칭': '#FBCFE8',
    '퀴즈': '#FDE68A',
    '체험': '#A7F3D0',
    '음식': '#FED7AA',
    '포토': '#FBCFE8',
    'default': '#E5E7EB',
}

export default function Booths() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // 이벤트 데이터 (모든 이벤트 = 부스)
    const { data: events = [], isLoading } = useEvents()

    // 모든 이벤트를 부스로 표시
    const booths = events

    // 검색 및 카테고리 필터링
    const filteredBooths = booths.filter(booth => {
        const matchesCategory = selectedCategory === 'all' || booth.category === selectedCategory
        const matchesSearch = booth.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booth.description?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const getCategoryColor = (category: string) => {
        for (const key of Object.keys(PASTEL_COLORS)) {
            if (category?.includes(key)) return PASTEL_COLORS[key as keyof typeof PASTEL_COLORS]
        }
        return PASTEL_COLORS.default
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 pt-12 pb-6 px-4">
                <h1 className="text-2xl font-bold text-white mb-2">🎪 부스 모아보기</h1>
                <p className="text-white/80 text-sm">학과별 부스와 체험 프로그램</p>
            </div>

            {/* 검색 */}
            <div className="px-4 -mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="부스 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 outline-none text-sm"
                    />
                </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="px-4 mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {BOOTH_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === category.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 부스 목록 */}
            <div className="px-4 mt-4 space-y-3">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">로딩 중...</div>
                ) : filteredBooths.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">🔍</div>
                        <p className="text-gray-500">검색 결과가 없습니다</p>
                    </div>
                ) : (
                    filteredBooths.map((booth) => (
                        <Link
                            key={booth.id}
                            to={`/events/${booth.id}`}
                            className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex items-start gap-4">
                                {/* 아이콘 */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                                    style={{ backgroundColor: getCategoryColor(booth.category || '') }}
                                >
                                    {booth.category === '게임' ? '🎮' :
                                        booth.category === '매칭' ? '💕' :
                                            booth.category === '퀴즈' ? '❓' :
                                                booth.category === '체험' ? '🎨' :
                                                    booth.category === '음식' ? '🍔' :
                                                        booth.category === '포토' ? '📸' : '🎪'}
                                </div>

                                {/* 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: getCategoryColor(booth.category || ''),
                                                color: '#374151'
                                            }}
                                        >
                                            {booth.category || '부스'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 truncate">{booth.title}</h3>
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {booth.description || '탭하여 상세보기'}
                                    </p>
                                    {booth.location && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                            <MapPin className="w-3 h-3" />
                                            <span>{booth.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 화살표 */}
                                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
