import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface ReservationCardProps {
    reservation: Reservation
    onViewDetail: (reservation: Reservation) => void
    onStatusChange: (id: string, newStatus: Reservation['status']) => void
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    // 소문자
    pending: {
        label: '대기',
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock,
    },
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
    rejected: {
        label: '거절',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
    },
    // 대문자
    PENDING: {
        label: '대기',
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock,
    },
    CONFIRMED: {
        label: '확정',
        color: 'bg-blue-100 text-blue-700',
        icon: CheckCircle,
    },
    CHECKED_IN: {
        label: '체크인',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: '취소',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
    },
    NO_SHOW: {
        label: '노쇼',
        color: 'bg-gray-100 text-gray-700',
        icon: AlertCircle,
    },
    REJECTED: {
        label: '거절',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
    },
}

const defaultStatus = {
    label: '알수없음',
    color: 'bg-gray-100 text-gray-700',
    icon: HelpCircle,
}

export default function ReservationCard({ reservation, onViewDetail, onStatusChange }: ReservationCardProps) {
    const statusInfo = statusConfig[reservation.status] || defaultStatus
    const StatusIcon = statusInfo.icon

    // 백엔드 필드 호환성
    const userName = reservation.userName || reservation.user?.name || '사용자'
    const userPhone = reservation.userPhone || reservation.user?.phone || ''
    const eventName = reservation.eventName || reservation.event?.title || '행사'
    const startTimeStr = reservation.event?.startTime
    const eventDate = reservation.eventDate || (startTimeStr ? new Date(startTimeStr).toLocaleDateString() : '')
    const eventTime = reservation.eventTime || (startTimeStr ? new Date(startTimeStr).toLocaleTimeString() : '')
    const attendees = reservation.attendees || reservation.partySize || 1
    const studentVerified = reservation.studentVerified ?? reservation.user?.isStudentVerified
    const reservedAt = reservation.reservationDate || reservation.createdAt

    // 상태 정규화 (대소문자 처리)
    const normalizedStatus = reservation.status?.toLowerCase() || ''

    return (
        <div
            className="bg-white rounded-2xl shadow-sm p-4"
            onClick={() => onViewDetail(reservation)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{userName}</h3>
                        {studentVerified && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                학생인증
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{eventName}</p>
                    {userPhone && (
                        <p className="text-sm text-gray-500">📞 {userPhone}</p>
                    )}
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusInfo.color}`}
                >
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {eventDate} {eventTime}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{attendees}명</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>예약: {reservedAt ? new Date(reservedAt).toLocaleString() : '-'}</span>
                </div>
            </div>

            {/* PENDING 상태: 수락/거절 버튼 */}
            {normalizedStatus === 'pending' && (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'CONFIRMED' as any)
                        }}
                        className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition"
                    >
                        수락
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'REJECTED' as any)
                        }}
                        className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition"
                    >
                        거절
                    </button>
                </div>
            )}

            {/* CONFIRMED 상태: 체크인/취소 버튼 */}
            {normalizedStatus === 'confirmed' && (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'CHECKED_IN' as any)
                        }}
                        className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition"
                    >
                        체크인 처리
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(reservation.id, 'CANCELLED' as any)
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
