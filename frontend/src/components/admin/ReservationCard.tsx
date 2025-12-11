import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface ReservationCardProps {
    reservation: Reservation
    onViewDetail: (reservation: Reservation) => void
    onStatusChange: (id: string, newStatus: Reservation['status']) => void
}

const statusConfig = {
    confirmed: {
        label: '확정',
        color: 'bg-blue-100 text-blue-700',
        icon: CheckCircle,
    },
    'checked-in': {
        label: '체크인',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
    },
    cancelled: {
        label: '취소',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
    },
    'no-show': {
        label: '노쇼',
        color: 'bg-gray-100 text-gray-700',
        icon: AlertCircle,
    },
}

export default function ReservationCard({ reservation, onViewDetail, onStatusChange }: ReservationCardProps) {
    const StatusIcon = statusConfig[reservation.status].icon

    return (
        <div
            className="bg-white rounded-2xl shadow-sm p-4"
            onClick={() => onViewDetail(reservation)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{reservation.userName}</h3>
                        {reservation.studentVerified && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                학생인증
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{reservation.eventName}</p>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusConfig[reservation.status].color}`}
                >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[reservation.status].label}
                </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {reservation.eventDate} {reservation.eventTime}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{reservation.attendees}명</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>예약: {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleString() : '-'}</span>
                </div>
            </div>

            {reservation.status === 'confirmed' && (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'checked-in')
                        }}
                        className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition"
                    >
                        체크인 처리
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'cancelled')
                        }}
                        className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition"
                    >
                        예약 취소
                    </button>
                </div>
            )}
        </div>
    )
}
