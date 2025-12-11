import { Camera } from 'lucide-react'

interface QRCameraViewProps {
    onScan: (data: string) => void
    isScanning: boolean
}

export default function QRCameraView({ onScan: _onScan, isScanning }: QRCameraViewProps) {
    return (
        <div className="px-4 -mt-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden">
                    {/* 카메라 영역 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-600" />
                    </div>

                    {/* 스캔 프레임 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2/3 aspect-square relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                            {/* 스캔 라인 */}
                            {isScanning && (
                                <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 animate-pulse" style={{ animation: 'scan 2s linear infinite' }} />
                            )}
                        </div>
                    </div>

                    <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                        QR 코드를 프레임 안에 맞춰주세요
                    </p>
                </div>
            </div>
        </div>
    )
}
