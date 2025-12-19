import { CheckCircle, XCircle, User, Calendar, MapPin, Users, Phone, Loader2 } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface ScanResultProps {
    reservation: Reservation | null
    error: string | null
    onCheckIn: () => void
    onClear: () => void
    isLoading: boolean
}

const statusConfig: Record<string, { label: string; color: string }> = {
    // 소문자
    pending: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: '확정', color: 'bg-blue-100 text-blue-700' },
    'checked-in': { label: '체크인 완료', color: 'bg-green-100 text-green-700' },
    cancelled: { label: '취소됨', color: 'bg-red-100 text-red-700' },
    'no-show': { label: '노쇼', color: 'bg-gray-100 text-gray-700' },
    rejected: { label: '거절됨', color: 'bg-red-100 text-red-700' },
    // 대문자
    PENDING: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: '확정', color: 'bg-blue-100 text-blue-700' },
    CHECKED_IN: { label: '체크인 완료', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: '취소됨', color: 'bg-red-100 text-red-700' },
    NO_SHOW: { label: '노쇼', color: 'bg-gray-100 text-gray-700' },
    REJECTED: { label: '거절됨', color: 'bg-red-100 text-red-700' },
}

const defaultStatus = { label: '알수없음', color: 'bg-gray-100 text-gray-700' }

export default function ScanResult({ reservation, error, onCheckIn, onClear, isLoading }: ScanResultProps) {
    if (error) {
        return (
            <div className="px-4 mb-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <XCircle className="w-10 h-10 text-red-500" />
                        <div>
                            <h3 className="font-bold text-red-900">인식 실패</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        )
    }

    if (!reservation) return null

    // 백엔드 필드 호환성
    const userName = reservation.userName || reservation.user?.name || '사용자'
    const userPhone = reservation.userPhone || reservation.user?.phone || ''
    const eventName = reservation.eventName || reservation.event?.title || '행사'
    const startTimeStr = reservation.event?.startTime
    const eventDate = reservation.eventDate || (startTimeStr ? new Date(startTimeStr).toLocaleDateString() : '')
    const eventTime = reservation.eventTime || (startTimeStr ? new Date(startTimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
    const attendees = reservation.attendees || reservation.partySize || 1
    const studentVerified = reservation.studentVerified ?? reservation.user?.isStudentVerified

    const statusInfo = statusConfig[reservation.status] || defaultStatus
    const normalizedStatus = reservation.status?.toLowerCase() || ''

    const canCheckIn = normalizedStatus === 'confirmed'
    const isCheckedIn = normalizedStatus === 'checked_in' || normalizedStatus === 'checked-in'

    return (
        <div className="px-4 mb-6">
            <div className={`${isCheckedIn ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border-2 rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className={`w-10 h-10 ${isCheckedIn ? 'text-green-500' : 'text-blue-500'}`} />
                    <div>
                        <h3 className={`font-bold ${isCheckedIn ? 'text-green-900' : 'text-blue-900'}`}>
                            {isCheckedIn ? '체크인 완료' : '예약 확인'}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{userName}</span>
                        {studentVerified && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">학생인증</span>
                        )}
                    </div>
                    {userPhone && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4" />
                            <span>{userPhone}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>{eventName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>{eventDate} {eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4" />
                        <span>{attendees}명</span>
                    </div>
                </div>

                {canCheckIn ? (
                    <button
                        onClick={onCheckIn}
                        disabled={isLoading}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            '체크인 처리'
                        )}
                    </button>
                ) : isCheckedIn ? (
                    <div className="space-y-2">
                        <div className="text-center py-3 bg-green-100 rounded-xl">
                            <span className="text-green-700 font-medium">✓ 체크인이 완료되었습니다</span>
                        </div>
                        <button
                            onClick={onClear}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                        >
                            다음 스캔
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onClear}
                        className="w-full py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition"
                    >
                        다음 스캔
                    </button>
                )}
            </div>
        </div>
    )
}
