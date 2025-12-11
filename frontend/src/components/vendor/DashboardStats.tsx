import { TrendingUp, DollarSign, ShoppingBag, Star } from 'lucide-react'

interface DashboardStatsProps {
    todayRevenue: number
    orderCount: number
    pendingOrders: number
    rating: number
}

export default function DashboardStats({
    todayRevenue,
    orderCount,
    pendingOrders,
    rating,
}: DashboardStatsProps) {
    return (
        <div className="px-4 -mt-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                    <DollarSign className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">
                        {(todayRevenue / 10000).toFixed(0)}만원
                    </p>
                    <p className="text-sm text-green-100">오늘 매출</p>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>전일 대비 +15%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white shadow-lg">
                    <ShoppingBag className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{orderCount}</p>
                    <p className="text-sm text-blue-100">총 주문</p>
                    <p className="text-xs mt-2 text-blue-200">
                        대기 중: {pendingOrders}건
                    </p>
                </div>

                <div className="col-span-2 bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</p>
                            <p className="text-sm text-gray-600">평균 평점</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">리뷰 128개</p>
                        <p className="text-xs text-gray-500">이번 주 +12개</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
