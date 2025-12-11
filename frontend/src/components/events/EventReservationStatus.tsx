import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import type { Event } from '@/lib/api/events'

interface EventReservationStatusProps {
    event: Event
}

export default function EventReservationStatus({ event }: EventReservationStatusProps) {
    const isFull = event.currentReservations >= event.capacity
    const isAlmostFull = event.currentReservations >= event.capacity * 0.8
    const percentage = (event.currentReservations / event.capacity) * 100

    return (
        <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-3">예약 현황</h3>

                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">예약 현황</span>
                        <span className="text-sm font-bold text-gray-900">
                            {event.currentReservations} / {event.capacity}명
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all ${isFull
                                    ? 'bg-red-500'
                                    : isAlmostFull
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isFull ? (
                        <>
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">예약이 마감되었습니다</span>
                        </>
                    ) : isAlmostFull ? (
                        <>
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-orange-600">곧 마감됩니다! 서두르세요</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-green-600">예약 가능합니다</span>
                        </>
                    )}
                </div>

                {event.requiresStudentVerification && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                            🎓 학생 인증 필요
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
