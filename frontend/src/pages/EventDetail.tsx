import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, X, Navigation, Ticket, Users, GraduationCap, CheckCircle, Clock, Ban, XCircle } from 'lucide-react'
import { useEvent } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { useCreateReservation, useMyReservations, useCancelReservation } from '@/hooks/useReservations'
import EventDetailHeader from '@/components/events/EventDetailHeader'
import EventInfoCard from '@/components/events/EventInfoCard'
import EventDescription from '@/components/events/EventDescription'
import { toast } from '@/components/ui/Toast'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState<'reserve' | 'cancel' | null>(null)
  const { user, isAuthenticated } = useAuth()
  const createReservation = useCreateReservation()
  const cancelReservation = useCancelReservation()

  // API에서 이벤트 데이터 가져오기
  const { data: event, isLoading, error } = useEvent(id!)

  // 내 예약 목록 가져오기
  const { data: myReservations = [] } = useMyReservations()

  // 이 이벤트에 대한 내 예약 확인
  const myReservation = myReservations.find(r => r.eventId === id && ['PENDING', 'CONFIRMED', 'CHECKED_IN'].includes(r.status))

  // 예약 버튼 클릭
  const handleReservationClick = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다')
      navigate('/login')
      return
    }

    if (event?.isStudentOnly && !user?.isStudentVerified) {
      toast.error('학생 인증이 필요한 행사입니다')
      navigate('/student-verification')
      return
    }

    setShowConfirmModal('reserve')
  }

  // 예약 확정
  const handleConfirmReservation = async () => {
    try {
      await createReservation.mutateAsync({
        eventId: id!,
        partySize: 1,
      })
      toast.success(event?.reservationType === 'SELECTION' ? '신청이 접수되었습니다. 선정 결과를 기다려주세요!' : '예약이 완료되었습니다!')
      setShowConfirmModal(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || '예약에 실패했습니다')
    }
  }

  // 예약 취소 버튼 클릭
  const handleCancelClick = () => {
    setShowConfirmModal('cancel')
  }

  // 예약 취소 확정
  const handleConfirmCancel = async () => {
    if (!myReservation) return

    try {
      await cancelReservation.mutateAsync(myReservation.id)
      toast.success('예약이 취소되었습니다')
      setShowConfirmModal(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || '취소에 실패했습니다')
    }
  }

  // 공유
  const handleShare = () => {
    alert('공유 기능은 준비 중입니다!')
  }

  // 위치 확인하기 - 지도로 이동
  const handleViewLocation = () => {
    if (event?.latitude && event?.longitude) {
      navigate(`/map?lat=${event.latitude}&lng=${event.longitude}&eventId=${event.id}`)
    } else {
      navigate('/map')
    }
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

  // 예약 상태 확인
  const isFull = event.capacity !== null && event.currentReservations >= event.capacity
  const canReserve = event.reservationEnabled && !isFull && !myReservation

  // 예약 버튼 텍스트 및 스타일
  const getReservationButton = () => {
    if (myReservation) {
      const statusConfig: Record<string, { text: string; icon: any; className: string }> = {
        PENDING: { text: '심사 대기중', icon: Clock, className: 'bg-yellow-500' },
        CONFIRMED: { text: '예약 완료됨', icon: CheckCircle, className: 'bg-green-500' },
        CHECKED_IN: { text: '체크인 완료', icon: CheckCircle, className: 'bg-blue-500' },
      }
      const config = statusConfig[myReservation.status] || statusConfig.PENDING
      const Icon = config.icon
      const canCancel = myReservation.status === 'PENDING' || myReservation.status === 'CONFIRMED'

      return (
        <div className="flex gap-2 flex-1">
          <button
            disabled
            className={`flex-1 py-4 ${config.className} text-white rounded-2xl font-bold flex items-center justify-center gap-2`}
          >
            <Icon className="w-5 h-5" />
            {config.text}
          </button>
          {canCancel && (
            <button
              onClick={handleCancelClick}
              className="px-4 py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-red-600 transition"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      )
    }

    if (!event.reservationEnabled) {
      return null
    }

    if (isFull) {
      return (
        <button
          disabled
          className="flex-1 py-4 bg-gray-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <Ban className="w-5 h-5" />
          마감됨
        </button>
      )
    }

    if (event.isStudentOnly && !user?.isStudentVerified) {
      return (
        <button
          onClick={() => navigate('/student-verification')}
          className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
        >
          <GraduationCap className="w-5 h-5" />
          학생 인증 필요
        </button>
      )
    }

    return (
      <button
        onClick={handleReservationClick}
        disabled={createReservation.isPending}
        className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
      >
        {createReservation.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Ticket className="w-5 h-5" />
        )}
        {event.reservationType === 'SELECTION' ? '참가 신청하기' : '예약하기'}
      </button>
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

      {/* 예약 정보 배너 */}
      {event.reservationEnabled && (
        <div className="px-4 mb-4">
          <div className={`rounded-2xl p-4 ${isFull ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${isFull ? 'text-red-600' : 'text-blue-600'}`} />
                <span className="font-medium text-gray-900">
                  {event.reservationType === 'SELECTION' ? '참가 신청' : '예약'}
                </span>
              </div>
              <div className="text-right">
                <p className={`font-bold ${isFull ? 'text-red-600' : 'text-blue-600'}`}>
                  {event.currentReservations || 0} / {event.capacity}명
                </p>
                <p className="text-xs text-gray-500">
                  {event.reservationType === 'SELECTION' ? '선정 방식' : '선착순'}
                </p>
              </div>
            </div>
            {event.isStudentOnly && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1 text-green-700 text-sm">
                  <GraduationCap className="w-4 h-4" />
                  학생 전용 행사
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <EventDescription description={event.description} images={event.images} />

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex gap-3">
          {getReservationButton()}
          <button
            onClick={handleViewLocation}
            className={`${event.reservationEnabled ? 'w-16' : 'flex-1'} py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition`}
          >
            <Navigation className="w-5 h-5" />
            {!event.reservationEnabled && '위치 확인하기'}
          </button>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6">
            {showConfirmModal === 'reserve' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.reservationType === 'SELECTION' ? '참가 신청' : '예약'} 확인
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">{event.title}</span>
                    {event.reservationType === 'SELECTION'
                      ? '에 참가 신청하시겠습니까?'
                      : '을(를) 예약하시겠습니까?'}
                  </p>
                  {event.reservationType === 'SELECTION' && (
                    <p className="text-sm text-orange-600 mt-2">
                      ※ 선정 방식이므로 관리자 승인 후 확정됩니다
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    disabled={createReservation.isPending}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createReservation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      '확인'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">예약 취소</h3>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">{event.title}</span>
                    {' '}예약을 취소하시겠습니까?
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    ※ 취소 후 다시 예약하려면 빈 자리가 있어야 합니다
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    돌아가기
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    disabled={cancelReservation.isPending}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {cancelReservation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      '취소하기'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
