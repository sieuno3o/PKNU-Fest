import { PieChart } from 'lucide-react'

interface MenuSale {
    menuId: string
    menuName: string
    totalRevenue: number
    totalQuantity: number
}

interface MenuSalesRankingProps {
    menuSalesData: MenuSale[] | undefined
}

export default function MenuSalesRanking({ menuSalesData }: MenuSalesRankingProps) {
    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-900">메뉴별 판매 순위</h3>
                </div>

                {menuSalesData && menuSalesData.length > 0 ? (
                    <div className="space-y-3">
                        {menuSalesData.map((menu, index) => (
                            <div
                                key={menu.menuId}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${index === 0
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                            : index === 1
                                                ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                                                : index === 2
                                                    ? 'bg-gradient-to-br from-orange-400 to-amber-600'
                                                    : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900">{menu.menuName}</h4>
                                        <span className="text-sm font-bold text-green-600">
                                            {((menu.totalRevenue || 0) / 10000).toFixed(0)}만원
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">메뉴</span>
                                        <span className="text-xs text-gray-600">{menu.totalQuantity || 0}개 판매</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">판매 데이터가 없습니다.</p>
                )}
            </div>
        </div>
    )
}
