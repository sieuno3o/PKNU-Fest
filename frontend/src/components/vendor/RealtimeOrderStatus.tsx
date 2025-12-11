import { Clock, Check, Loader2 } from 'lucide-react'

interface RealtimeOrderStatusProps {
    pendingCount: number
    preparingCount: number
    readyCount: number
    onViewAll: () => void
}

export default function RealtimeOrderStatus({
    pendingCount,
    preparingCount,
    readyCount,
    onViewAll,
}: RealtimeOrderStatusProps) {
    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">실시간 주문 현황</h3>
                    </div>
                    <button
                        onClick={onViewAll}
                        className="text-sm text-purple-600 font-medium"
                    >
                        전체보기
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <Loader2 className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                        <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                        <p className="text-xs text-orange-700">대기 중</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                        <p className="text-2xl font-bold text-blue-600">{preparingCount}</p>
                        <p className="text-xs text-blue-700">준비 중</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                        <Check className="w-6 h-6 mx-auto mb-1 text-green-500" />
                        <p className="text-2xl font-bold text-green-600">{readyCount}</p>
                        <p className="text-xs text-green-700">완료</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
