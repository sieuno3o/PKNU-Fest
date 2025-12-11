import { XCircle, Mail } from 'lucide-react'
import type { Reservation } from '@/stores/reservationStore'

interface ReservationDetailModalProps {
  isOpen: boolean
  reservation: Reservation | null
  onClose: () => void
  onStatusChange: (id: string, newStatus: Reservation['status']) => void
}

const statusConfig = {
  confirmed: {
    label: '확정',
    color: 'bg-blue-100 text-blue-700',
  },
  'checked-in': {
    label: '체크인',
    color: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: '취소',
    color: 'bg-red-100 text-red-700',
  },
  'no-show': {
    label: '노쇼',
    color: 'bg-gray-100 text-gray-700',
  },
}

export default function ReservationDetailModal({
  isOpen,
  reservation,
  onClose,
  onStatusChange,
}: ReservationDetailModalProps) {
  if (!isOpen || !reservation) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">예약 상세</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 사용자 정보 */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">사용자 정보</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">이름</span>
                <span className="text-sm font-medium">{reservation.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">이메일</span>
                <span className="text-sm font-medium">{reservation.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">전화번호</span>
                <span className="text-sm font-medium">{reservation.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">학생 인증</span>
                <span className="text-sm font-medium">
                  {reservation.studentVerified ? '✓ 완료' : '✗ 미완료'}
                </span>
              </div>
            </div>
          </div>

          {/* 행사 정보 */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">행사 정보</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">행사명</span>
                <span className="text-sm font-medium">{reservation.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">날짜/시간</span>
                <span className="text-sm font-medium">
                  {reservation.eventDate} {reservation.eventTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">장소</span>
                <span className="text-sm font-medium">
                  {reservation.eventLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">인원</span>
                <span className="text-sm font-medium">{reservation.attendees}명</span>
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">예약 정보</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">예약 ID</span>
                <span className="text-sm font-medium font-mono">{reservation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">예약일시</span>
                <span className="text-sm font-medium">
                  {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">상태</span>
                <span
                  className={`text-sm font-bold px-2 py-1 rounded-full ${statusConfig[reservation.status].color}`}
                >
                  {statusConfig[reservation.status].label}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          {reservation.status === 'confirmed' && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onStatusChange(reservation.id, 'checked-in')
                  onClose()
                }}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
              >
                체크인 처리
              </button>
              <button
                onClick={() => {
                  onStatusChange(reservation.id, 'cancelled')
                  onClose()
                }}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                예약 취소
              </button>
              <button
                onClick={() => alert('이메일 발송 기능은 곧 구현될 예정입니다.')}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                알림 메일 발송
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
