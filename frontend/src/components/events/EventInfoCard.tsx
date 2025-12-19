import { Calendar, MapPin } from 'lucide-react'
import type { Event } from '@/lib/api/events'

interface EventInfoCardProps {
    event: Event
}

// DateTime 파싱 헬퍼 함수
const formatDate = (dateTime: string | undefined) => {
    if (!dateTime) return '-'
    try {
        const date = new Date(dateTime)
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
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

export default function EventInfoCard({ event }: EventInfoCardProps) {
    return (
        <div className="p-4 -mt-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-600 font-bold">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{event.location || '장소 미정'}</span>
                </div>
            </div>
        </div>
    )
}
