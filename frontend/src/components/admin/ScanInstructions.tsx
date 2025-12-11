import { Info, CheckCircle } from 'lucide-react'

export default function ScanInstructions() {
    return (
        <div className="px-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">사용 방법</h3>
                </div>

                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">
                            참가자가 보여주는 QR 코드를 카메라로 스캔하세요
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">
                            예약 정보가 화면에 표시되면 '체크인 처리' 버튼을 누르세요
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">
                            QR 코드가 안 되면 예약 코드를 직접 입력할 수 있습니다
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
