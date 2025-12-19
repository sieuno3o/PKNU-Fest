import { useState, useCallback } from 'react'
import { useCheckInReservation } from '@/hooks/useReservations'
import { reservationsApi } from '@/lib/api/reservations'
import type { Reservation } from '@/stores/reservationStore'
import QRScannerHeader from '@/components/admin/QRScannerHeader'
import QRCameraView from '@/components/admin/QRCameraView'
import ManualInputSection from '@/components/admin/ManualInputSection'
import ScanResult from '@/components/admin/ScanResult'
import ScanInstructions from '@/components/admin/ScanInstructions'
import { toast } from '@/components/ui/Toast'

export default function QRScanner() {
  const [scannedReservation, setScannedReservation] = useState<Reservation | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [autoCheckIn, setAutoCheckIn] = useState(true) // 자동 체크인 모드

  const checkIn = useCheckInReservation()

  // QR 스캔 처리
  const handleScan = useCallback(async (data: string) => {
    if (isLoading) return // 중복 스캔 방지

    setIsScanning(false)
    setScanError(null)
    setScannedReservation(null)
    setIsLoading(true)

    try {
      // QR 데이터에서 예약 ID 추출
      // 지원 형식: "reservation:{id}", "RES-{id}", 직접 UUID
      let reservationId = data.trim()

      if (reservationId.startsWith('reservation:')) {
        reservationId = reservationId.replace('reservation:', '')
      } else if (reservationId.startsWith('RES-')) {
        reservationId = reservationId.replace('RES-', '')
      }

      console.log('Fetching reservation:', reservationId)

      // API로 예약 정보 조회
      const reservation = await reservationsApi.getById(reservationId)
      console.log('Reservation data:', reservation)

      if (!reservation) {
        throw new Error('예약을 찾을 수 없습니다')
      }

      const normalizedStatus = reservation.status?.toUpperCase() || ''

      // 자동 체크인 모드이고, 예약이 CONFIRMED 상태면 바로 체크인
      if (autoCheckIn && normalizedStatus === 'CONFIRMED') {
        try {
          await checkIn.mutateAsync(reservationId)
          setScannedReservation({
            ...reservation,
            status: 'CHECKED_IN',
          })
          toast.success('체크인이 완료되었습니다! ✅')
        } catch (checkInError: any) {
          console.error('Auto check-in error:', checkInError)
          // 체크인 실패해도 예약 정보는 표시
          setScannedReservation(reservation)
          setScanError(checkInError.response?.data?.message || '자동 체크인에 실패했습니다')
        }
      } else if (normalizedStatus === 'CHECKED_IN') {
        setScannedReservation(reservation)
        toast.info('이미 체크인된 예약입니다')
      } else if (normalizedStatus === 'PENDING') {
        setScannedReservation(reservation)
        setScanError('대기 중인 예약입니다. 먼저 승인이 필요합니다.')
      } else if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'REJECTED') {
        setScannedReservation(reservation)
        setScanError('취소되거나 거절된 예약입니다')
      } else {
        setScannedReservation(reservation)
      }
    } catch (error: any) {
      console.error('Scan error:', error)
      setScanError(
        error.response?.status === 404
          ? '해당 예약을 찾을 수 없습니다'
          : error.response?.status === 403
            ? '권한이 없습니다. 관리자 계정으로 로그인해주세요.'
            : error.response?.data?.message || '유효하지 않은 예약 코드입니다'
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, autoCheckIn, checkIn])

  // 수동 체크인 처리
  const handleCheckIn = async () => {
    if (!scannedReservation) return

    try {
      await checkIn.mutateAsync(scannedReservation.id)
      setScannedReservation({
        ...scannedReservation,
        status: 'CHECKED_IN',
      })
      toast.success('체크인이 완료되었습니다! ✅')
    } catch (error: any) {
      setScanError(error.response?.data?.message || '체크인 처리에 실패했습니다.')
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

      {/* 자동 체크인 토글 */}
      <div className="px-4 mb-4">
        <label className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <span className="text-gray-700 font-medium">스캔 시 자동 체크인</span>
          <button
            onClick={() => setAutoCheckIn(!autoCheckIn)}
            className={`relative w-12 h-6 rounded-full transition ${autoCheckIn ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoCheckIn ? 'left-7' : 'left-1'}`}
            />
          </button>
        </label>
      </div>

      <QRCameraView
        onScan={handleScan}
        isScanning={isScanning}
      />

      <ManualInputSection
        onSubmit={handleScan}
        isLoading={isLoading || checkIn.isPending}
      />

      <ScanResult
        reservation={scannedReservation}
        error={scanError}
        onCheckIn={handleCheckIn}
        onClear={handleClear}
        isLoading={checkIn.isPending}
      />

      {!scannedReservation && !scanError && !isLoading && <ScanInstructions />}
    </div>
  )
}
