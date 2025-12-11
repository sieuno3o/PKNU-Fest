import { CheckCircle, XCircle, User, Calendar, MapPin, Users } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface ScanResultProps {
    reservation: Reservation | null
    error: string | null
    onCheckIn: () => void
    onClear: () => void
    isLoading: boolean
}

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

    const statusColors = {
        'confirmed': 'bg-blue-100 text-blue-700',
        'checked-in': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700',
        'no-show': 'bg-gray-100 text-gray-700',
    }

    return (
        <div className="px-4 mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                    <div>
                        <h3 className="font-bold text-green-900">예약 확인</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[reservation.status]}`}>
                            {reservation.status === 'confirmed' ? '확정' :
                                reservation.status === 'checked-in' ? '체크인 완료' :
                                    reservation.status === 'cancelled' ? '취소됨' : '노쇼'}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{reservation.userName}</span>
                        {reservation.studentVerified && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">학생인증</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>{reservation.eventName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.eventDate} {reservation.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4" />
                        <span>{reservation.attendees}명</span>
                    </div>
                </div>

                {reservation.status === 'confirmed' ? (
                    <button
                        onClick={onCheckIn}
                        disabled={isLoading}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isLoading ? '처리 중...' : '체크인 처리'}
                    </button>
                ) : reservation.status === 'checked-in' ? (
                    <div className="text-center py-3 bg-green-100 rounded-xl">
                        <span className="text-green-700 font-medium">이미 체크인 되었습니다</span>
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
