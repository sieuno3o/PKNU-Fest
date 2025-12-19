import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { useAllReservations, useUpdateReservation } from '@/hooks/useReservations'
import type { Reservation } from '@/stores/reservationStore'
import ReservationHeader from '@/components/admin/ReservationHeader'
import ReservationStats from '@/components/admin/ReservationStats'
import ReservationSearchBar from '@/components/admin/ReservationSearchBar'
import ReservationFilter from '@/components/admin/ReservationFilter'
import ReservationCard from '@/components/admin/ReservationCard'
import ReservationDetailModal from '@/components/admin/ReservationDetailModal'

export default function ReservationManagement() {
  const { data: reservations = [] } = useAllReservations()
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
      reservation.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || reservation.status?.toLowerCase() === selectedStatus
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
  const handleStatusChange = (id: string, newStatus: string) => {
    updateReservation.mutate({ id, data: { status: newStatus as any } })
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

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <ReservationHeader />
      <ReservationStats {...stats} />

      {/* 검색 및 필터 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <ReservationSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportClick={handleExportExcel}
        />
        <ReservationFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* 예약 목록 */}
      <div className="p-4 space-y-3">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">예약이 없습니다</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetail={handleViewDetail}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <ReservationDetailModal
        isOpen={showDetailModal}
        reservation={selectedReservation}
        onClose={() => setShowDetailModal(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
