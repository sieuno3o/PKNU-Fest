import { DollarSign, ShoppingBag, TrendingUp, BarChart3, Award } from 'lucide-react'

interface SalesStatCardsProps {
    revenue: number
    orders: number
    avgOrderValue: number
    topMenu: string
}

export default function SalesStatCards({ revenue, orders, avgOrderValue, topMenu }: SalesStatCardsProps) {
    return (
        <div className="px-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
                    <DollarSign className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold mb-1">
                        {(revenue / 10000).toFixed(0)}만원
                    </p>
                    <p className="text-sm text-green-100">오늘 매출</p>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>전일 대비 +12.5%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-xl">
                    <ShoppingBag className="w-8 h-8 mb-2 opacity-80" />
                    <p className="text-3xl font-bold mb-1">{orders}</p>
                    <p className="text-sm text-blue-100">주문 건수</p>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>전일 대비 +8.3%</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-purple-100">
                    <BarChart3 className="w-8 h-8 mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        {avgOrderValue.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">평균 주문 금액</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-orange-100">
                    <Award className="w-8 h-8 mb-2 text-orange-600" />
                    <p className="text-xl font-bold text-gray-900 mb-1">{topMenu}</p>
                    <p className="text-sm text-gray-600">인기 메뉴</p>
                </div>
            </div>
        </div>
    )
}
