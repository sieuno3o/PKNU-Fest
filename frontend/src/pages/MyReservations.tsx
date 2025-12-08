import { useState } from 'react'
import { Calendar, MapPin, Clock, Users, QrCode, X, Trash2 } from 'lucide-react'

// 타입 정의
type ReservationStatus = 'confirmed' | 'cancelled' | 'completed'

interface Reservation {
  id: string
  eventId: string
  eventName: string
  eventImage: string
  date: string
  time: string
  location: string
  partySize: number
  status: ReservationStatus
  qrCode: string
}

// TODO: 나중에 API에서 가져올 데이터
const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    eventId: '1',
    eventName: '아이유 콘서트',
    eventImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    date: '2024-12-15',
    time: '19:00',
    location: '대운동장',
    partySize: 2,
    status: 'confirmed', // confirmed, cancelled, completed
    qrCode: 'RES-001-2024',
  },
  {
    id: 'res-002',
    eventId: '2',
    eventName: '체험 부스 - AR/VR',
    eventImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
    date: '2024-12-16',
    time: '14:00',
    location: '공학관',
    partySize: 1,
    status: 'confirmed',
    qrCode: 'RES-002-2024',
  },
  {
    id: 'res-003',
    eventId: '3',
    eventName: '게임 대회',
    eventImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    date: '2024-12-10',
    time: '14:00',
    location: '학생회관',
    partySize: 4,
    status: 'completed',
    qrCode: 'RES-003-2024',
  },
]

const statusConfig: Record<
  ReservationStatus,
  { label: string; color: string }
> = {
  confirmed: {
    label: '예약 확정',
    color: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: '취소됨',
    color: 'bg-red-100 text-red-700',
  },
  completed: {
    label: '이용 완료',
    color: 'bg-gray-100 text-gray-700',
  },
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [selectedQR, setSelectedQR] = useState<Reservation | null>(null)

  // 예약 취소
  const cancelReservation = (id: string) => {
    const confirmed = confirm('예약을 취소하시겠습니까?')
    if (confirmed) {
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: 'cancelled' as const } : res))
      )
      alert('예약이 취소되었습니다.')
    }
  }

  // 진행 중인 예약
  const activeReservations = reservations.filter((res) => res.status === 'confirmed')
  // 완료/취소된 예약
  const pastReservations = reservations.filter(
    (res) => res.status === 'completed' || res.status === 'cancelled'
  )

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">내 예약</h1>
        <p className="text-blue-100">예약 내역을 확인하고 관리하세요</p>
      </div>

      <div className="p-4 space-y-6">
        {/* 진행 중인 예약 */}
        {activeReservations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">진행 중인 예약</h2>
            <div className="space-y-4">
              {activeReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={reservation.eventImage}
                      alt={reservation.eventName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{reservation.eventName}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            statusConfig[reservation.status].color
                          }`}
                        >
                          {statusConfig[reservation.status].label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {reservation.date} {reservation.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{reservation.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{reservation.partySize}명</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedQR(reservation)}
                          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        >
                          <QrCode className="w-4 h-4" />
                          QR
                        </button>
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm opacity-70"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={reservation.eventImage}
                      alt={reservation.eventName}
                      className="w-24 h-24 object-cover rounded-xl grayscale"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{reservation.eventName}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            statusConfig[reservation.status].color
                          }`}
                        >
                          {statusConfig[reservation.status].label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {reservation.date} {reservation.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{reservation.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 예약 없음 */}
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

      {/* QR 코드 모달 */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">체크인 QR 코드</h3>
              <button
                onClick={() => setSelectedQR(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <h4 className="font-bold text-lg mb-2">{selectedQR.eventName}</h4>
              <p className="text-sm text-gray-600 mb-6">
                {selectedQR.date} {selectedQR.time}
              </p>

              {/* QR 코드 (API 사용) */}
              <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    selectedQR.qrCode
                  )}`}
                  alt="QR Code"
                  className="w-full h-auto"
                />
              </div>

              <p className="text-sm text-gray-600 mb-2">예약 번호</p>
              <p className="text-lg font-mono font-bold text-gray-900 mb-6">{selectedQR.qrCode}</p>

              <p className="text-xs text-gray-500">입장 시 이 QR 코드를 스캔해주세요</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
