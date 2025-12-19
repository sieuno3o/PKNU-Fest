import { Calendar, MapPin, Users, QrCode, Trash2, Loader2 } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

const statusConfig: Record<string, { label: string; color: string }> = {
    // 소문자
    pending: { label: '심사 대기', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: '예약 확정', color: 'bg-green-100 text-green-700' },
    cancelled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
    'checked-in': { label: '이용 완료', color: 'bg-blue-100 text-blue-700' },
    'no-show': { label: '노쇼', color: 'bg-gray-100 text-gray-700' },
    rejected: { label: '거절됨', color: 'bg-red-100 text-red-700' },
    // 대문자
    PENDING: { label: '심사 대기', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: '예약 확정', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: '취소됨', color: 'bg-red-100 text-red-700' },
    CHECKED_IN: { label: '이용 완료', color: 'bg-blue-100 text-blue-700' },
    NO_SHOW: { label: '노쇼', color: 'bg-gray-100 text-gray-700' },
    REJECTED: { label: '거절됨', color: 'bg-red-100 text-red-700' },
}

const defaultStatus = { label: '상태 알수없음', color: 'bg-gray-100 text-gray-700' }

interface ActiveReservationCardProps {
    reservation: Reservation
    onShowQR: (reservation: Reservation) => void
    onCancel: (id: string) => void
    isCancelling: boolean
}

export default function ActiveReservationCard({
    reservation,
    onShowQR,
    onCancel,
    isCancelling,
}: ActiveReservationCardProps) {
    // 백엔드 필드 호환성
    const eventName = reservation.eventName || reservation.event?.title || '행사'
    const eventDate = reservation.eventDate || (reservation.event?.startTime ? new Date(reservation.event.startTime).toLocaleDateString() : '')
    const eventTime = reservation.eventTime || (reservation.event?.startTime ? new Date(reservation.event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
    const location = reservation.location || reservation.event?.location || reservation.eventLocation || ''
    const attendees = reservation.attendees || reservation.partySize || 1
    const eventImage = reservation.eventImage || reservation.event?.thumbnail || reservation.event?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'

    const statusInfo = statusConfig[reservation.status] || defaultStatus

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-4">
                <img
                    src={eventImage}
                    alt={eventName}
                    className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{eventName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{eventDate} {eventTime}</span>
                        </div>
                        {location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{location}</span>
                            </div>
                        )}
                        {attendees && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{attendees}명</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onShowQR(reservation)}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        >
                            <QrCode className="w-4 h-4" />
                            QR
                        </button>
                        <button
                            onClick={() => onCancel(reservation.id)}
                            disabled={isCancelling}
                            className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
