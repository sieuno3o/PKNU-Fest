import { useState } from 'react'
import { useCheckInReservation } from '@/hooks/useReservations'
import type { Reservation } from '@/stores/reservationStore'
import QRScannerHeader from '@/components/admin/QRScannerHeader'
import QRCameraView from '@/components/admin/QRCameraView'
import ManualInputSection from '@/components/admin/ManualInputSection'
import ScanResult from '@/components/admin/ScanResult'
import ScanInstructions from '@/components/admin/ScanInstructions'

export default function QRScanner() {
  const [scannedReservation, setScannedReservation] = useState<Reservation | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  const checkIn = useCheckInReservation()

  // QR 스캔 처리
  const handleScan = async (data: string) => {
    setIsScanning(false)
    setScanError(null)
    setScannedReservation(null)

    try {
      // TODO: 실제 API 호출로 예약 조회
      // const reservation = await getReservationByCode(data)
      // setScannedReservation(reservation)

      // 임시 Mock 데이터
      setScannedReservation({
        id: data,
        eventId: 'event-1',
        eventName: '아이유 콘서트',
        userId: 'user-1',
        userName: '김부경',
        userEmail: 'student@pknu.ac.kr',
        userPhone: '010-1234-5678',
        eventDate: '2024-12-07',
        eventTime: '14:00',
        eventLocation: '대운동장',
        location: '대운동장',
        attendees: 2,
        status: 'confirmed',
        studentVerified: true,
        reservationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      setScanError('유효하지 않은 예약 코드입니다.')
    }
  }

  // 체크인 처리
  const handleCheckIn = async () => {
    if (!scannedReservation) return

    try {
      await checkIn.mutateAsync(scannedReservation.id)
      setScannedReservation({
        ...scannedReservation,
        status: 'checked-in',
      })
    } catch (error) {
      setScanError('체크인 처리에 실패했습니다.')
    }
  }

  // 결과 초기화
  const handleClear = () => {
    setScannedReservation(null)
    setScanError(null)
    setIsScanning(true)
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <QRScannerHeader />

      <QRCameraView
        onScan={handleScan}
        isScanning={isScanning}
      />

      <ManualInputSection
        onSubmit={handleScan}
        isLoading={checkIn.isPending}
      />

      <ScanResult
        reservation={scannedReservation}
        error={scanError}
        onCheckIn={handleCheckIn}
        onClear={handleClear}
        isLoading={checkIn.isPending}
      />

      {!scannedReservation && !scanError && <ScanInstructions />}
    </div>
  )
}
