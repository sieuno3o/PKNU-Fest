import { Calendar, MapPin, Users, Edit2, Trash2 } from 'lucide-react'
import type { Event } from '@/lib/api/events'

interface EventCardProps {
    event: Event
    onEdit: (event: Event) => void
    onDelete: (id: string) => void
}

const statusConfig = {
    ongoing: { label: '진행중', color: 'bg-green-100 text-green-700' },
    upcoming: { label: '예정', color: 'bg-blue-100 text-blue-700' },
    ended: { label: '종료', color: 'bg-gray-100 text-gray-700' },
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-4 p-4">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                            <span className="text-xs text-gray-600">{event.category}</span>
                        </div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${statusConfig[event.status].color}`}
                        >
                            {statusConfig[event.status].label}
                        </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {event.date} {event.startTime} - {event.endTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>
                                {event.currentReservations}/{event.capacity}명
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
