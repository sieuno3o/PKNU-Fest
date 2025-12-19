import { useMemo } from 'react'
import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Star, Calendar, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useVendorOrders } from '@/hooks/useOrders'

export default function VendorStats() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // 푸드트럭 ID 가져오기
    const truckId = (user as any)?.foodTruckId || user?.id

    // 오늘 날짜
    const today = new Date()
    const todayStr = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    // 오늘 주문 데이터 가져오기
    const { data: orders = [], isLoading } = useVendorOrders(truckId!, {})

    // 오늘 주문만 필터링
    const todayOrders = useMemo(() => {
        const todayDate = today.toISOString().split('T')[0]
        return orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
            return orderDate === todayDate
        })
    }, [orders])

    // 통계 계산
    const stats = useMemo(() => {
        const completed = todayOrders.filter((o: any) => o.status === 'COMPLETED' || o.status === 'DELIVERED')
        const totalRevenue = completed.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        const totalOrders = todayOrders.length
        const completedOrders = completed.length
        const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

        return {
            totalRevenue,
            totalOrders,
            completedOrders,
            avgOrderValue,
        }
    }, [todayOrders])

    // 메뉴별 판매량 계산
    const menuSales = useMemo(() => {
        const menuMap = new Map<string, { name: string; quantity: number; revenue: number }>()

        todayOrders.forEach((order: any) => {
            if (order.status === 'COMPLETED' || order.status === 'DELIVERED') {
                order.items?.forEach((item: any) => {
                    const existing = menuMap.get(item.menuId || item.id)
                    if (existing) {
                        existing.quantity += item.quantity || 1
                        existing.revenue += (item.price || 0) * (item.quantity || 1)
                    } else {
                        menuMap.set(item.menuId || item.id, {
                            name: item.menuName || item.name || '메뉴',
                            quantity: item.quantity || 1,
                            revenue: (item.price || 0) * (item.quantity || 1),
                        })
                    }
                })
            }
        })

        return Array.from(menuMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
    }, [todayOrders])

    // 시간대별 주문
    const hourlyOrders = useMemo(() => {
        const hours: Record<number, number> = {}
        for (let i = 9; i <= 21; i++) hours[i] = 0

        todayOrders.forEach((order: any) => {
            const hour = new Date(order.createdAt).getHours()
            if (hours[hour] !== undefined) hours[hour]++
        })

        return Object.entries(hours).map(([hour, count]) => ({
            hour: `${hour}:00`,
            count,
        }))
    }, [todayOrders])

    const maxHourlyCount = Math.max(...hourlyOrders.map(h => h.count), 1)

    if (!truckId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">푸드트럭 정보를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-xl font-medium"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6">
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl hover:bg-white/30 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">오늘의 매출</h1>
                        <p className="text-white/80 text-sm">{todayStr}</p>
                    </div>
                </div>
            </div>

            {/* 주요 통계 카드 */}
            <div className="px-4 -mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">오늘 매출</p>
                        <p className="text-xl font-bold text-gray-900">
                            {isLoading ? '...' : `₩${stats.totalRevenue.toLocaleString()}`}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">총 주문</p>
                        <p className="text-xl font-bold text-gray-900">
                            {isLoading ? '...' : `${stats.totalOrders}건`}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">평균 주문가</p>
                        <p className="text-xl font-bold text-gray-900">
                            {isLoading ? '...' : `₩${Math.round(stats.avgOrderValue).toLocaleString()}`}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">완료 주문</p>
                        <p className="text-xl font-bold text-gray-900">
                            {isLoading ? '...' : `${stats.completedOrders}건`}
                        </p>
                    </div>
                </div>
            </div>

            {/* 시간대별 주문 */}
            <div className="px-4 mt-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900">시간대별 주문</h2>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-end justify-between h-32 gap-1">
                        {hourlyOrders.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-orange-500 to-red-400 rounded-t"
                                    style={{ height: `${(item.count / maxHourlyCount) * 100}%`, minHeight: item.count > 0 ? '8px' : '2px' }}
                                />
                                <span className="text-[10px] text-gray-500 mt-1">{item.hour.split(':')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 인기 메뉴 순위 */}
            <div className="px-4 mt-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4">오늘 인기 메뉴</h2>

                    {menuSales.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">아직 판매된 메뉴가 없습니다</p>
                    ) : (
                        <div className="space-y-3">
                            {menuSales.map((menu, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                            index === 1 ? 'bg-gray-300 text-gray-700' :
                                                index === 2 ? 'bg-orange-300 text-orange-800' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{menu.name}</p>
                                        <p className="text-xs text-gray-500">{menu.quantity}개 판매</p>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        ₩{menu.revenue.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 매출 보고서 다운로드 버튼 */}
            <div className="px-4 mt-6">
                <button
                    onClick={() => alert('엑셀 다운로드 기능은 곧 구현될 예정입니다.')}
                    className="w-full py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition"
                >
                    <Download className="w-5 h-5" />
                    매출 보고서 다운로드
                </button>
            </div>
        </div>
    )
}
