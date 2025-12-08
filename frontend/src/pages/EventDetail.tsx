import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Users, GraduationCap, Share2, Heart, AlertCircle, Loader2 } from 'lucide-react'
import { useEvent } from '@/hooks/useEvents'

// 카테고리별 색상 매핑
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    '공연': 'from-pink-500 to-purple-600',
    '체험': 'from-orange-500 to-red-600',
    '게임': 'from-blue-500 to-cyan-600',
    '토크': 'from-indigo-500 to-purple-600',
    '기타': 'from-green-500 to-emerald-600',
  }
  return colors[category] || 'from-gray-500 to-gray-600'
}

// 카테고리별 이모지 매핑
const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    '공연': '🎵',
    '체험': '🎨',
    '게임': '🎮',
    '토크': '💬',
    '기타': '🎪',
  }
  return emojis[category] || '🎪'
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)

  // API에서 이벤트 데이터 가져오기
  const { data: event, isLoading, error } = useEvent(id!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">데이터를 불러올 수 없습니다</h3>
              <p className="text-sm text-red-800">
                {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <p className="text-gray-500">행사를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  const reservationPercentage = event.capacity
    ? (event.currentReservations / event.capacity) * 100
    : 0
  const isFull = event.capacity ? event.currentReservations >= event.capacity : false

  const handleShare = () => {
    // TODO: 공유 기능 구현
    alert('공유 기능은 준비 중입니다!')
  }

  const handleReservation = () => {
    setShowReservationModal(true)
  }

  return (
    <>
      <div className="pb-4">
        {/* 헤더 이미지 */}
        <div className={`relative h-64 bg-gradient-to-br ${getCategoryColor(event.category)}`}>
          {/* 뒤로가기 & 액션 버튼 */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 이미지 또는 이모지 */}
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl">
                {getCategoryEmoji(event.category)}
              </div>
            </div>
          )}

          {/* 학생 전용 배지 */}
          {event.requiresStudentVerification && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-600">학생 전용</span>
            </div>
          )}
        </div>

        {/* 기본 정보 */}
        <div className="bg-white px-4 py-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg mb-3">
            {event.category}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 날짜/시간/장소 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{event.date}</p>
                <p className="text-sm text-gray-600">{event.startTime} ~ {event.endTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 예약 현황 */}
        {event.capacity && (
          <div className="bg-gray-50 px-4 py-6">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-900">예약 현황</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {event.currentReservations}/{event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    reservationPercentage > 80
                      ? 'bg-red-500'
                      : reservationPercentage > 50
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${reservationPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {isFull ? '예약 마감' : `${event.capacity - event.currentReservations}자리 남음`}
              </p>
            </div>
          </div>
        )}

        {/* 상세 설명 */}
        <div className="bg-white px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">행사 소개</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        {/* 주의사항 (학생 전용인 경우) */}
        {event.requiresStudentVerification && (
          <div className="bg-blue-50 mx-4 rounded-2xl p-4 mb-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">학생 인증 필수</h3>
                <p className="text-sm text-blue-800">
                  이 행사는 학생 전용입니다. 예약하려면 마이페이지에서 학생 인증을 완료해주세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 예약 버튼 (고정) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleReservation}
            disabled={isFull}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isFull
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isFull ? '예약 마감' : '예약하기'}
          </button>
        </div>
      </div>

      {/* 예약 모달 */}
      {showReservationModal && (
        <ReservationModal
          event={event}
          onClose={() => setShowReservationModal(false)}
        />
      )}
    </>
  )
}

// 예약 모달 컴포넌트
interface ReservationModalProps {
  event: {
    id: string
    title: string
    date: string
    startTime: string
    location: string
  }
  onClose: () => void
}

function ReservationModal({ event, onClose }: ReservationModalProps) {
  const [partySize, setPartySize] = useState(1)
  const navigate = useNavigate()

  const handleConfirm = () => {
    // TODO: API 연동
    console.log('예약:', { eventId: event.id, partySize })
    alert(`예약이 완료되었습니다! (${partySize}명)`)
    onClose()
    navigate('/my-reservations')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">예약하기</h2>

        {/* 행사 정보 요약 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {event.date} {event.startTime}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.location}
            </p>
          </div>
        </div>

        {/* 인원 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">인원 선택</label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold transition"
            >
              -
            </button>
            <span className="text-3xl font-bold text-gray-900 w-16 text-center">{partySize}</span>
            <button
              onClick={() => setPartySize(Math.min(4, partySize + 1))}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold transition"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">최대 4명까지 예약 가능합니다</p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition"
          >
            예약 확인
          </button>
        </div>
      </div>
    </div>
  )
}
