import { useState, useRef, useEffect } from 'react'
import {
  Camera,
  CheckCircle,
  XCircle,
  QrCode,
  User,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

interface ScanResult {
  success: boolean
  message: string
  reservation?: {
    id: string
    userName: string
    eventName: string
    eventDate: string
    eventTime: string
    location: string
    attendees: number
    status: string
  }
}

export default function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // 카메라 시작
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setScanning(true)
      setScanResult(null)
    } catch (error) {
      alert('카메라 접근 권한이 필요합니다.')
    }
  }

  // 카메라 종료
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setScanning(false)
  }

  // QR 코드 스캔 (실제로는 QR 코드 라이브러리 사용 필요)
  const handleScan = (code: string) => {
    // TODO: 실제로는 API 호출
    // 예시: QR 코드가 예약 ID를 담고 있다고 가정
    const mockResult: ScanResult = {
      success: true,
      message: '체크인이 완료되었습니다.',
      reservation: {
        id: code,
        userName: '김철수',
        eventName: '아이유 콘서트',
        eventDate: '2024-12-15',
        eventTime: '19:00',
        location: '대운동장',
        attendees: 2,
        status: 'checked-in',
      },
    }

    setScanResult(mockResult)
    stopCamera()

    // 성공 피드백
    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
  }

  // 수동 입력 처리
  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      alert('예약 코드를 입력해주세요.')
      return
    }

    handleScan(manualCode)
    setManualCode('')
  }

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // 재시도
  const handleRetry = () => {
    setScanResult(null)
    setManualCode('')
  }

  // 데모용 QR 스캔 (실제로는 QR 코드 라이브러리 통합 필요)
  const handleDemoScan = () => {
    const demoCode = `res-${Date.now()}`
    handleScan(demoCode)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">체크인 QR 스캐너</h1>
        <p className="text-indigo-100">QR 코드를 스캔하여 체크인을 처리하세요</p>
      </div>

      {/* 스캔 결과가 없을 때 */}
      {!scanResult && (
        <div className="p-4 space-y-4">
          {/* QR 코드 스캔 영역 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {!scanning ? (
              <div className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">QR 코드 스캔</h3>
                <p className="text-gray-600 mb-6">
                  카메라를 시작하여 예약자의 QR 코드를 스캔하세요
                </p>
                <button
                  onClick={startCamera}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  카메라 시작
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 object-cover bg-black"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-white rounded-2xl shadow-2xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-center mb-4">QR 코드를 네모 안에 맞춰주세요</p>
                  <div className="flex gap-2">
                    <button
                      onClick={stopCamera}
                      className="flex-1 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-bold hover:bg-white/30 transition"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleDemoScan}
                      className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition"
                    >
                      데모 스캔
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 수동 입력 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">수동 입력</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              QR 코드를 스캔할 수 없는 경우 예약 코드를 직접 입력하세요
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="예약 코드 입력 (예: res-101)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <button
                onClick={handleManualSubmit}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                확인
              </button>
            </div>
          </div>

          {/* 사용 안내 */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              사용 안내
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>카메라 버튼을 눌러 스캔을 시작합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>예약자의 QR 코드를 화면 중앙에 맞춥니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>자동으로 인식되면 체크인이 완료됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>문제가 있을 경우 수동 입력을 사용하세요</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 스캔 결과 */}
      {scanResult && (
        <div className="p-4">
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              scanResult.success ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}
          >
            <div className="p-8 text-center text-white">
              {scanResult.success ? (
                <CheckCircle className="w-24 h-24 mx-auto mb-4" />
              ) : (
                <XCircle className="w-24 h-24 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">
                {scanResult.success ? '체크인 완료!' : '체크인 실패'}
              </h2>
              <p className="text-white/90 text-lg">{scanResult.message}</p>
            </div>

            {scanResult.success && scanResult.reservation && (
              <div className="bg-white p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {scanResult.reservation.userName}
                    </h3>
                    <p className="text-sm text-gray-600">예약자 정보</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">행사명</p>
                      <p className="font-medium">{scanResult.reservation.eventName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">일시</p>
                      <p className="font-medium">
                        {scanResult.reservation.eventDate} {scanResult.reservation.eventTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">장소</p>
                      <p className="font-medium">{scanResult.reservation.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-5 h-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">인원</p>
                      <p className="font-medium">{scanResult.reservation.attendees}명</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">예약 코드</span>
                    <span className="font-mono font-medium text-gray-900">
                      {scanResult.reservation.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">상태</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      체크인 완료
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-white border-t border-gray-200">
              <button
                onClick={handleRetry}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                다음 스캔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
