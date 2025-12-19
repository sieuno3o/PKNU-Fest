import { Link } from 'react-router-dom'
import { LogIn, Calendar, MapPinned, Clock, ChevronRight, Ticket, Loader2 } from 'lucide-react'
import { useMyReservations } from '@/hooks/useReservations'

interface MyReservationsProps {
  isLoggedIn: boolean
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: '대기', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  CONFIRMED: { label: '확정', color: 'text-green-700', bgColor: 'bg-green-100' },
  CHECKED_IN: { label: '입장완료', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  CANCELLED: { label: '취소', color: 'text-red-700', bgColor: 'bg-red-100' },
  REJECTED: { label: '거절', color: 'text-red-700', bgColor: 'bg-red-100' },
  confirmed: { label: '확정', color: 'text-green-700', bgColor: 'bg-green-100' },
  pending: { label: '대기', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  'checked-in': { label: '입장완료', color: 'text-blue-700', bgColor: 'bg-blue-100' },
}

const defaultStatus = { label: '예약됨', color: 'text-gray-700', bgColor: 'bg-gray-100' }

export default function MyReservations({ isLoggedIn }: MyReservationsProps) {
  const { data: reservations = [], isLoading } = useMyReservations()

  // 활성 예약만 표시 (취소/거절 제외)
  const activeReservations = reservations
    .filter((r: any) => {
      const status = r.status?.toUpperCase()
      return status !== 'CANCELLED' && status !== 'REJECTED' && status !== 'NO_SHOW'
    })
    .slice(0, 3) // 최대 3개만 표시

  if (!isLoggedIn) {
    return (
      <section className="px-4 py-6 bg-white">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span>내 예약</span>
        </h2>

        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-20 rounded-full -ml-10 -mb-10" />

          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium mb-5">로그인하고 예약을 관리하세요</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogIn className="w-5 h-5 mr-2" />
              로그인하러 가기
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span>내 예약</span>
          {activeReservations.length > 0 && (
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {activeReservations.length}
            </span>
          )}
        </h2>
        <Link
          to="/my-reservations"
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          전체보기 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : activeReservations.length === 0 ? (
        <div className="text-center py-8">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">예약된 행사가 없습니다</p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            행사 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activeReservations.map((reservation: any) => {
            const statusInfo = statusConfig[reservation.status] || defaultStatus
            const eventName = reservation.eventName || reservation.event?.title || '행사'
            const eventDate = reservation.eventDate || (reservation.event?.startTime ? new Date(reservation.event.startTime).toLocaleDateString('ko-KR') : '')
            const eventTime = reservation.eventTime || (reservation.event?.startTime ? new Date(reservation.event.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '')
            const location = reservation.location || reservation.eventLocation || reservation.event?.location || ''

            return (
              <Link
                key={reservation.id}
                to={`/events/${reservation.eventId}`}
                className="block bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:from-blue-50 hover:to-purple-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{eventName}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{eventDate}</span>
                        </div>
                      )}
                      {eventTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{eventTime}</span>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-center gap-1.5">
                          <MapPinned className="w-3.5 h-3.5" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.color} ${statusInfo.bgColor}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
