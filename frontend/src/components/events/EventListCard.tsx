import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, GraduationCap } from 'lucide-react'
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

interface EventListCardProps {
    event: Event
}

export default function EventListCard({ event }: EventListCardProps) {
    const reservationPercentage = event.capacity
        ? (event.currentReservations / event.capacity) * 100
        : 0

    return (
        <Link
            to={`/events/${event.id}`}
            className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
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
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                    </div>
                </div>

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
                                className={`h-full rounded-full transition-all ${reservationPercentage > 80
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
}
