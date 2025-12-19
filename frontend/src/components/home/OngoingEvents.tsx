import { Link } from 'react-router-dom'
import { ChevronRight, Clock, MapPinned, Users, Loader2 } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'

// 카테고리별 이모지 및 색상
const categoryConfig: Record<string, { emoji: string; color: string }> = {
  '공연': { emoji: '🎵', color: 'from-pink-500 to-purple-600' },
  '체험': { emoji: '🎨', color: 'from-orange-500 to-red-600' },
  '게임': { emoji: '🎮', color: 'from-blue-500 to-cyan-600' },
  '전시': { emoji: '🖼️', color: 'from-green-500 to-teal-600' },
  '강연': { emoji: '📚', color: 'from-yellow-500 to-orange-600' },
  '기타': { emoji: '✨', color: 'from-gray-500 to-gray-700' },
}

function getEventCategory(event: any): { emoji: string; color: string } {
  const category = event.category || event.type || '기타'
  return categoryConfig[category] || categoryConfig['기타']
}

function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function OngoingEvents() {
  const { data: events = [], isLoading, error } = useEvents()

  // 진행 중이거나 곧 시작할 이벤트 (예약 가능한 것만)
  const upcomingEvents = events
    .filter((event: any) => {
      if (!event.reservationEnabled) return true // 예약 없어도 표시
      return true
    })
    .slice(0, 6) // 최대 6개

  if (isLoading) {
    return (
      <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </section>
    )
  }

  if (error || upcomingEvents.length === 0) {
    return (
      <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span>진행 중인 행사</span>
          </h2>
          <Link
            to="/events"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            더보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          현재 진행 중인 행사가 없습니다
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span>진행 중인 행사</span>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {upcomingEvents.length}
          </span>
        </h2>
        <Link
          to="/events"
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          더보기 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 가로 스크롤 카드 */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {upcomingEvents.map((event: any) => {
          const { emoji, color } = getEventCategory(event)
          const thumbnail = event.thumbnail || event.image

          return (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* 썸네일 */}
              <div className={`relative w-full h-28 ${thumbnail ? '' : `bg-gradient-to-br ${color}`} flex items-center justify-center overflow-hidden`}>
                {thumbnail ? (
                  <img src={thumbnail} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{emoji}</span>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />

                {event.reservationEnabled && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    예약가능
                  </div>
                )}
              </div>

              {/* 카드 내용 */}
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-1">
                  {event.startTime && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPinned className="w-3.5 h-3.5" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.currentReservations || 0}/{event.capacity}명</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
