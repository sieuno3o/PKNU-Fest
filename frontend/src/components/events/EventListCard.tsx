import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, GraduationCap } from 'lucide-react'
import type { Event } from '@/lib/api/events'

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

// DateTime 파싱 헬퍼 함수
const formatDate = (dateTime: string | undefined) => {
    if (!dateTime) return '-'
    try {
        const date = new Date(dateTime)
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    } catch {
        return '-'
    }
}

const formatTime = (dateTime: string | undefined) => {
    if (!dateTime) return '-'
    try {
        const date = new Date(dateTime)
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    } catch {
        return '-'
    }
}

interface EventListCardProps {
    event: Event
}

export default function EventListCard({ event }: EventListCardProps) {
    const eventImage = event.image || event.thumbnail

    return (
        <Link
            to={`/events/${event.id}`}
            className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
            <div className={`relative h-40 bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center`}>
                {event.requiresStudentVerification && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 z-10">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600">학생 전용</span>
                    </div>
                )}
                {eventImage ? (
                    <img src={eventImage} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-white text-6xl">{getCategoryEmoji(event.category)}</div>
                )}
            </div>

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
                        <span>{formatDate(event.startTime)}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{formatTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location || '장소 미정'}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
