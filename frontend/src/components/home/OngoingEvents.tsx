import { Link } from 'react-router-dom'
import { ChevronRight, Clock, MapPinned } from 'lucide-react'

interface Event {
  id: string
  title: string
  category: string
  time: string
  location: string
  thumbnail: string | null
  color: string
}

interface OngoingEventsProps {
  events?: Event[]
}

export default function OngoingEvents({ events = [] }: OngoingEventsProps) {
  // TODO: 실제로는 API에서 가져올 데이터
  const defaultEvents: Event[] = [
    {
      id: '1',
      title: '아이유 콘서트',
      category: '🎵',
      time: '19:00',
      location: '대운동장',
      thumbnail: null,
      color: 'from-pink-500 to-purple-600',
    },
    {
      id: '2',
      title: '체험 부스',
      category: '🎨',
      time: '10:00',
      location: '학생회관',
      thumbnail: null,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: '3',
      title: '게임 대회',
      category: '🎮',
      time: '14:00',
      location: '대강당',
      thumbnail: null,
      color: 'from-blue-500 to-cyan-600',
    },
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

  return (
    <section className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span>지금 진행 중</span>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {displayEvents.length}
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
        {displayEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group flex-shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* 썸네일 */}
            <div className={`relative w-full h-24 bg-gradient-to-br ${event.color} flex items-center justify-center text-3xl overflow-hidden`}>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative z-10">{event.category}</span>
            </div>

            {/* 카드 내용 */}
            <div className="p-3">
              <h3 className="font-bold text-sm text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPinned className="w-3.5 h-3.5" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
