import { Clock } from 'lucide-react'

interface HourlyData {
    hour: string
    orders: number
    revenue: number
}

interface HourlySalesChartProps {
    data: HourlyData[]
    peakHour: string
}

export default function HourlySalesChart({ data, peakHour }: HourlySalesChartProps) {
    const maxRevenue = Math.max(...data.map((h) => h.revenue))

    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-900">시간대별 매출</h3>
                </div>

                <div className="space-y-3">
                    {data.map((hourData) => (
                        <div key={hourData.hour}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{hourData.hour}</span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-gray-900">
                                        {(hourData.revenue / 10000).toFixed(0)}만원
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">{hourData.orders}건</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(hourData.revenue / maxRevenue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-purple-600">
                    <Clock className="w-4 h-4" />
                    <span>피크 시간: {peakHour} (35건)</span>
                </div>
            </div>
        </div>
    )
}
