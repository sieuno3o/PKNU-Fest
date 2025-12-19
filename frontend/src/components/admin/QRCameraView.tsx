import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff, RefreshCw } from 'lucide-react'

interface QRCameraViewProps {
    onScan: (data: string) => void
    isScanning: boolean
}

export default function QRCameraView({ onScan, isScanning }: QRCameraViewProps) {
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [isCameraStarted, setIsCameraStarted] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const isStartingRef = useRef(false)
    const isMountedRef = useRef(true)

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                const state = scannerRef.current.getState()
                // 2 = SCANNING, 3 = PAUSED
                if (state === 2 || state === 3) {
                    await scannerRef.current.stop()
                }
            } catch (e) {
                // 에러 무시 - 이미 멈춰있을 수 있음
                console.log('Scanner stop ignored:', e)
            }
            scannerRef.current = null
        }
        if (isMountedRef.current) {
            setIsCameraStarted(false)
        }
    }, [])

    const startScanner = useCallback(async () => {
        if (isStartingRef.current || !isMountedRef.current) return
        isStartingRef.current = true

        try {
            setCameraError(null)

            // 기존 스캐너 정리
            await stopScanner()

            // DOM 요소 확인
            const element = document.getElementById('qr-reader')
            if (!element) {
                console.log('QR reader element not found')
                isStartingRef.current = false
                return
            }

            const html5QrCode = new Html5Qrcode('qr-reader')
            scannerRef.current = html5QrCode

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // QR 코드 스캔 성공
                    if (isMountedRef.current) {
                        onScan(decodedText)
                    }
                },
                () => {
                    // 스캔 실패 (무시)
                }
            )

            if (isMountedRef.current) {
                setIsCameraStarted(true)
            }
        } catch (err: any) {
            console.error('Camera error:', err)
            if (isMountedRef.current) {
                setCameraError(
                    err.message?.includes('Permission')
                        ? '카메라 권한을 허용해주세요'
                        : err.message?.includes('NotFound') || err.message?.includes('NotReadableError')
                            ? '카메라를 찾을 수 없습니다'
                            : '카메라를 시작할 수 없습니다'
                )
                setIsCameraStarted(false)
            }
        } finally {
            isStartingRef.current = false
        }
    }, [onScan, stopScanner])

    useEffect(() => {
        isMountedRef.current = true

        if (isScanning) {
            // 약간의 딜레이 후 시작 (DOM 마운트 보장)
            const timer = setTimeout(() => {
                startScanner()
            }, 100)
            return () => clearTimeout(timer)
        } else {
            stopScanner()
        }

        return () => {
            isMountedRef.current = false
            stopScanner()
        }
    }, [isScanning, startScanner, stopScanner])

    // 카메라 재시작
    const handleRetry = () => {
        setCameraError(null)
        startScanner()
    }

    return (
        <div className="px-4 -mt-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden">
                    {/* 카메라 영역 */}
                    <div id="qr-reader" className="w-full h-full" />

                    {/* 에러 상태 */}
                    {cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4">
                            <CameraOff className="w-16 h-16 text-red-500" />
                            <p className="text-white text-center px-4">{cameraError}</p>
                            <button
                                onClick={handleRetry}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                                다시 시도
                            </button>
                        </div>
                    )}

                    {/* 로딩 상태 */}
                    {!cameraError && !isCameraStarted && isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4">
                            <Camera className="w-16 h-16 text-gray-400 animate-pulse" />
                            <p className="text-white">카메라 시작 중...</p>
                        </div>
                    )}

                    {/* 스캔 프레임 (카메라 작동 시) */}
                    {isCameraStarted && !cameraError && (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-2/3 aspect-square relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
                                </div>
                            </div>

                            <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/30 py-2">
                                QR 코드를 프레임 안에 맞춰주세요
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
