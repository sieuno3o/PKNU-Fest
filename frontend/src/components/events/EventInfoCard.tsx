import { Calendar, MapPin, Users } from 'lucide-react'
import type { Event } from '@/lib/api/events'

interface EventInfoCardProps {
    event: Event
}

export default function EventInfoCard({ event }: EventInfoCardProps) {
    return (
        <div className="p-4 -mt-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-600 font-bold">
                            {event.startTime} - {event.endTime}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">
                        {event.currentReservations}/{event.capacity}명 예약
                    </span>
                    {event.currentReservations >= event.capacity && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                            마감
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
