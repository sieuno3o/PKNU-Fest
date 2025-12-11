import { TrendingUp } from 'lucide-react'

interface WeeklySummaryProps {
    revenue: number
    revenueChange: number
    orders: number
    ordersChange: number
}

export default function WeeklySummary({ revenue, revenueChange, orders, ordersChange }: WeeklySummaryProps) {
    return (
        <div className="px-4 mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6" />
                    <h3 className="font-bold text-lg">이번 주 요약</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-purple-200 mb-1">총 매출</p>
                        <p className="text-2xl font-bold">
                            {(revenue / 10000).toFixed(0)}만원
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{revenueChange}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-purple-200 mb-1">총 주문</p>
                        <p className="text-2xl font-bold">{orders}건</p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{ordersChange}%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-400/30">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-200">일 평균 매출</span>
                        <span className="font-bold">
                            {(revenue / 7 / 10000).toFixed(0)}만원
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
