import { Calendar } from 'lucide-react'

interface DaySale {
    date: string
    revenue: number
    orders: number
    avgOrderValue: number
}

interface DailySalesTrendProps {
    data: DaySale[]
}

export default function DailySalesTrend({ data }: DailySalesTrendProps) {
    const maxRevenue = Math.max(...data.map((d) => d.revenue))
    const avgRevenue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length

    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-900">최근 5일 매출</h3>
                </div>

                <div className="space-y-3">
                    {data.map((day) => (
                        <div key={day.date} className="flex items-center gap-3">
                            <div className="w-16 text-sm text-gray-600 font-medium">
                                {new Date(day.date).toLocaleDateString('ko-KR', {
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-gray-900">
                                        {(day.revenue / 10000).toFixed(0)}만원
                                    </span>
                                    <span className="text-xs text-gray-500">{day.orders}건</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                        style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">5일 평균</span>
                        <span className="font-bold text-gray-900">
                            {(avgRevenue / 10000).toFixed(0)}만원
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
