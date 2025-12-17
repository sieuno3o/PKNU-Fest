import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, X } from 'lucide-react'
import { useEvent } from '@/hooks/useEvents'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/ui/Toast'
import EventDetailHeader from '@/components/events/EventDetailHeader'
import EventInfoCard from '@/components/events/EventInfoCard'
import EventReservationStatus from '@/components/events/EventReservationStatus'
import EventDescription from '@/components/events/EventDescription'
import EventReservationButton from '@/components/events/EventReservationButton'
import ReservationModal from '@/components/events/ReservationModal'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)

  // API에서 이벤트 데이터 가져오기
  const { data: event, isLoading, error } = useEvent(id!)

  // 인증 상태 가져오기
  const { user, isAuthenticated } = useAuthStore()

  // 공유
  const handleShare = () => {
    alert('공유 기능은 준비 중입니다!')
  }

  // 예약
  const handleReservation = () => {
    // 학생 전용 행사인 경우 인증 확인
    if (event?.requiresStudentVerification) {
      if (!isAuthenticated) {
        toast.error('로그인이 필요합니다')
        navigate('/login')
        return
      }
      if (!user?.isVerified) {
        toast.warning('이 행사는 학생 전용입니다. 학생 인증이 필요합니다.')
        navigate('/student-verification')
        return
      }
    }
    setShowReservationModal(true)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    )
  }

  // 에러 상태
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <X className="w-20 h-20 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">행사를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">요청하신 행사 정보가 없습니다.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium"
        >
          행사 목록으로
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <EventDetailHeader
        event={event}
        isLiked={isLiked}
        onBack={() => navigate(-1)}
        onLike={() => setIsLiked(!isLiked)}
        onShare={handleShare}
      />
      <EventInfoCard event={event} />
      <EventReservationStatus event={event} />
      <EventDescription description={event.description} />
      <EventReservationButton
        event={event}
        onReservation={handleReservation}
      />

      {/* 예약 모달 */}
      {showReservationModal && (
        <ReservationModal
          event={event}
          onClose={() => setShowReservationModal(false)}
        />
      )}
    </div>
  )
}
