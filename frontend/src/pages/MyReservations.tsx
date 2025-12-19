import { useState } from 'react'
import { Calendar, Loader2, X, Clock, CheckCircle, XCircle, Ban } from 'lucide-react'
import { useMyReservations, useCancelReservation } from '@/hooks/useReservations'
import type { Reservation } from '@/stores/reservationStore'
import MyReservationsHeader from '@/components/reservations/MyReservationsHeader'
import ActiveReservationCard from '@/components/reservations/ActiveReservationCard'
import PastReservationCard from '@/components/reservations/PastReservationCard'
import QRCodeModal from '@/components/reservations/QRCodeModal'

// 상태 정규화 함수
const normalizeStatus = (status: string) => status?.toUpperCase() || ''

export default function MyReservations() {
  const [selectedQR, setSelectedQR] = useState<Reservation | null>(null)
  const { data: reservations = [], isLoading, error } = useMyReservations()
  const cancelMutation = useCancelReservation()

  const handleCancelReservation = async (id: string) => {
    if (confirm('예약을 취소하시겠습니까?')) {
      try {
        await cancelMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to cancel reservation:', error)
      }
    }
  }

  // 대기 중인 예약 (선정 방식)
  const pendingReservations = reservations.filter((res) => normalizeStatus(res.status) === 'PENDING')

  // 확정된 예약 (진행 중)
  const activeReservations = reservations.filter((res) => normalizeStatus(res.status) === 'CONFIRMED')

  // 지난 예약 (체크인, 취소, 거절, 노쇼)
  const pastReservations = reservations.filter((res) => {
    const status = normalizeStatus(res.status)
    return ['CHECKED_IN', 'CANCELLED', 'REJECTED', 'NO_SHOW'].includes(status)
  })

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">예약 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">예약 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <MyReservationsHeader />

      <div className="p-4 space-y-6">
        {/* 대기 중인 예약 (선정 방식) */}
        {pendingReservations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              심사 대기 중
            </h2>
            <div className="space-y-4">
              {pendingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-yellow-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {reservation.eventName || reservation.event?.title || '행사'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {reservation.eventDate || (reservation.event?.startTime ? new Date(reservation.event.startTime).toLocaleDateString() : '')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full">
                      심사 대기
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    선정 방식으로 신청되어 관리자 승인을 기다리고 있습니다.
                  </p>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={cancelMutation.isPending}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                  >
                    신청 취소
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 확정된 예약 */}
        {activeReservations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              진행 중인 예약
            </h2>
            <div className="space-y-4">
              {activeReservations.map((reservation) => (
                <ActiveReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onShowQR={setSelectedQR}
                  onCancel={handleCancelReservation}
                  isCancelling={cancelMutation.isPending}
                />
              ))}
            </div>
          </section>
        )}

        {/* 지난 예약 */}
        {pastReservations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">지난 예약</h2>
            <div className="space-y-4">
              {pastReservations.map((reservation) => (
                <PastReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </section>
        )}

        {reservations.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">예약 내역이 없습니다</p>
            <button
              onClick={() => (window.location.href = '/events')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              행사 둘러보기
            </button>
          </div>
        )}
      </div>

      {selectedQR && <QRCodeModal reservation={selectedQR} onClose={() => setSelectedQR(null)} />}
    </div>
  )
}
