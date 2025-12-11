import { useState } from 'react'
import { Calendar, Loader2, X } from 'lucide-react'
import { useMyReservations, useCancelReservation } from '@/hooks/useReservations'
import type { Reservation } from '@/stores/reservationStore'
import MyReservationsHeader from '@/components/reservations/MyReservationsHeader'
import ActiveReservationCard from '@/components/reservations/ActiveReservationCard'
import PastReservationCard from '@/components/reservations/PastReservationCard'
import QRCodeModal from '@/components/reservations/QRCodeModal'

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

  const activeReservations = reservations.filter((res) => res.status === 'confirmed')
  const pastReservations = reservations.filter(
    (res) => res.status === 'checked-in' || res.status === 'cancelled' || res.status === 'no-show'
  )

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
        {activeReservations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">진행 중인 예약</h2>
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
