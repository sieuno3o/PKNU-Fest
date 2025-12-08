import { useState } from 'react'
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Mail,
  Loader2,
  X,
} from 'lucide-react'
import { useAllReservations, useCheckInReservation, useUpdateReservation } from '@/hooks/useReservations'
import type { Reservation } from '@/stores/reservationStore'
import { toast } from '@/components/ui/Toast'

export default function ReservationManagement() {
  const { data: reservations = [], isLoading, error } = useAllReservations()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'confirmed' | 'cancelled' | 'checked-in' | 'no-show'
  >('all')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 필터링
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // 통계
  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    checkedIn: reservations.filter((r) => r.status === 'checked-in').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  }

  const updateReservation = useUpdateReservation()

  // 예약 상태 변경
  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservation.mutate({ id, data: { status: newStatus } })
  }

  // 예약 상세보기
  const handleViewDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailModal(true)
  }

  // 엑셀 다운로드 (TODO: 실제 구현)
  const handleExportExcel = () => {
    alert('엑셀 다운로드 기능은 곧 구현될 예정입니다.')
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

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">예약 관리</h1>
        <p className="text-purple-100">모든 행사 예약을 확인하고 관리하세요</p>
      </div>

      {/* 통계 */}
      <div className="p-4 -mt-4">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600">전체</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            <p className="text-xs text-gray-600">확정</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
            <p className="text-xs text-gray-600">체크인</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-gray-600">취소</p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 행사명, 이메일 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-1"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'confirmed', 'checked-in', 'cancelled', 'no-show'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status === 'all'
                  ? '전체'
                  : statusConfig[status as keyof typeof statusConfig].label}
              </button>
            )
          )}
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="p-4 space-y-3">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">예약이 없습니다</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => {
            const StatusIcon = statusConfig[reservation.status].icon
            return (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-sm p-4"
                onClick={() => handleViewDetail(reservation)}
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
                    className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusConfig[reservation.status].color
                      }`}
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
                        handleStatusChange(reservation.id, 'checked-in')
                      }}
                      className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition"
                    >
                      체크인 처리
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusChange(reservation.id, 'cancelled')
                      }}
                      className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition"
                    >
                      예약 취소
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">예약 상세</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
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
                    <span className="text-sm font-medium">{selectedReservation.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이메일</span>
                    <span className="text-sm font-medium">{selectedReservation.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">전화번호</span>
                    <span className="text-sm font-medium">{selectedReservation.userPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">학생 인증</span>
                    <span className="text-sm font-medium">
                      {selectedReservation.studentVerified ? '✓ 완료' : '✗ 미완료'}
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
                    <span className="text-sm font-medium">{selectedReservation.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">날짜/시간</span>
                    <span className="text-sm font-medium">
                      {selectedReservation.eventDate} {selectedReservation.eventTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">장소</span>
                    <span className="text-sm font-medium">
                      {selectedReservation.eventLocation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">인원</span>
                    <span className="text-sm font-medium">{selectedReservation.attendees}명</span>
                  </div>
                </div>
              </div>

              {/* 예약 정보 */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">예약 정보</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">예약 ID</span>
                    <span className="text-sm font-medium font-mono">{selectedReservation.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">예약일시</span>
                    <span className="text-sm font-medium">
                      {selectedReservation.reservationDate ? new Date(selectedReservation.reservationDate).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">상태</span>
                    <span
                      className={`text-sm font-bold px-2 py-1 rounded-full ${statusConfig[selectedReservation.status].color
                        }`}
                    >
                      {statusConfig[selectedReservation.status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              {selectedReservation.status === 'confirmed' && (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation.id, 'checked-in')
                      setShowDetailModal(false)
                    }}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                  >
                    체크인 처리
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation.id, 'cancelled')
                      setShowDetailModal(false)
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
      )}
    </div>
  )
}
