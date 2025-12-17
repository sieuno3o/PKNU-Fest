import { Calendar, MapPin, Users, Edit2, Trash2, ImageOff } from 'lucide-react'
import type { Event } from '@/lib/api/events'
import { useState } from 'react'

interface EventCardProps {
    event: Event
    onEdit: (event: Event) => void
    onDelete: (id: string) => void
}

const statusConfig: Record<string, { label: string; color: string }> = {
    ongoing: { label: '진행중', color: 'bg-green-100 text-green-700' },
    upcoming: { label: '예정', color: 'bg-blue-100 text-blue-700' },
    ended: { label: '종료', color: 'bg-gray-100 text-gray-700' },
    ONGOING: { label: '진행중', color: 'bg-green-100 text-green-700' },
    PUBLISHED: { label: '공개', color: 'bg-blue-100 text-blue-700' },
    DRAFT: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
    FULL: { label: '마감', color: 'bg-orange-100 text-orange-700' },
    ENDED: { label: '종료', color: 'bg-gray-100 text-gray-700' },
}

const defaultStatus = { label: '미정', color: 'bg-gray-100 text-gray-700' }

// 날짜/시간 포맷팅 함수
const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return dateStr
    }
}

const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return ''
    try {
        // ISO 형식인 경우
        if (timeStr.includes('T')) {
            const date = new Date(timeStr)
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            }
        }
        return timeStr
    } catch {
        return timeStr
    }
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
    const statusInfo = statusConfig[event.status] || defaultStatus
    const [imgError, setImgError] = useState(false)

    const imageUrl = event.image || event.thumbnail
    const currentReservations = event.currentReservations ?? 0
    const capacity = event.capacity ?? '무제한'

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-4 p-4">
                {/* 정사각형 이미지 영역 */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {imageUrl && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageOff className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                            <span className="text-xs text-gray-600">{event.category}</span>
                        </div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}
                        >
                            {statusInfo.label}
                        </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>
                                {currentReservations}/{capacity}명
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(event)}
                            className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-1"
                        >
                            <Edit2 className="w-4 h-4" />
                            수정
                        </button>
                        <button
                            onClick={() => onDelete(event.id)}
                            className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

