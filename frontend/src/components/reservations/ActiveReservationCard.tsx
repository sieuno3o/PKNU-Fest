import { Calendar, MapPin, Users, QrCode, Trash2, Loader2 } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

const statusConfig: Record<string, { label: string; color: string }> = {
    confirmed: { label: '예약 확정', color: 'bg-green-100 text-green-700' },
    cancelled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
    'checked-in': { label: '이용 완료', color: 'bg-blue-100 text-blue-700' },
    'no-show': { label: '노쇼', color: 'bg-gray-100 text-gray-700' },
}

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
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-4">
                <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"
                    alt={reservation.eventName}
                    className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{reservation.eventName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusConfig[reservation.status].color}`}>
                            {statusConfig[reservation.status].label}
                        </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{reservation.eventDate} {reservation.eventTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{reservation.location}</span>
                        </div>
                        {reservation.attendees && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{reservation.attendees}명</span>
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
