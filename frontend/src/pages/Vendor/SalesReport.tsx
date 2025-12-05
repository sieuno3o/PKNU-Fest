import { useState } from 'react'
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  Download,
  PieChart,
  BarChart3,
  Award,
  Clock,
} from 'lucide-react'

interface SalesData {
  date: string
  revenue: number
  orders: number
  avgOrderValue: number
}

interface MenuSales {
  menuId: string
  menuName: string
  category: string
  quantity: number
  revenue: number
}

// TODO: 실제로는 API에서 가져올 데이터
const mockSalesData: SalesData[] = [
  { date: '2024-12-06', revenue: 450000, orders: 87, avgOrderValue: 5172 },
  { date: '2024-12-05', revenue: 520000, orders: 95, avgOrderValue: 5474 },
  { date: '2024-12-04', revenue: 380000, orders: 72, avgOrderValue: 5278 },
  { date: '2024-12-03', revenue: 490000, orders: 89, avgOrderValue: 5506 },
  { date: '2024-12-02', revenue: 410000, orders: 78, avgOrderValue: 5256 },
]

const mockMenuSales: MenuSales[] = [
  {
    menuId: 'menu-1',
    menuName: '치즈 떡볶이',
    category: '메인',
    quantity: 156,
    revenue: 780000,
  },
  {
    menuId: 'menu-2',
    menuName: '핫도그',
    category: '메인',
    quantity: 132,
    revenue: 396000,
  },
  {
    menuId: 'menu-3',
    menuName: '콜라',
    category: '음료',
    quantity: 245,
    revenue: 490000,
  },
  {
    menuId: 'menu-4',
    menuName: '타코야키',
    category: '사이드',
    quantity: 98,
    revenue: 392000,
  },
]

const mockHourlySales = [
  { hour: '10:00', orders: 5, revenue: 25000 },
  { hour: '11:00', orders: 12, revenue: 60000 },
  { hour: '12:00', orders: 28, revenue: 140000 },
  { hour: '13:00', orders: 35, revenue: 175000 },
  { hour: '14:00', orders: 22, revenue: 110000 },
  { hour: '15:00', orders: 18, revenue: 90000 },
  { hour: '16:00', orders: 15, revenue: 75000 },
  { hour: '17:00', orders: 25, revenue: 125000 },
  { hour: '18:00', orders: 32, revenue: 160000 },
  { hour: '19:00', orders: 28, revenue: 140000 },
]

export default function SalesReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  // 오늘 매출 통계
  const todayStats = {
    revenue: 450000,
    orders: 87,
    avgOrderValue: 5172,
    topMenu: '치즈 떡볶이',
    peakHour: '13:00',
  }

  // 주간 비교
  const weeklyComparison = {
    revenue: 2250000,
    revenueChange: 12.5,
    orders: 421,
    ordersChange: 8.3,
  }

  // 최대 매출 구하기 (차트용)
  const maxRevenue = Math.max(...mockHourlySales.map((h) => h.revenue))

  // 엑셀 다운로드
  const handleExportExcel = () => {
    alert('엑셀 다운로드 기능은 곧 구현될 예정입니다.')
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">매출 리포트</h1>
            <p className="text-purple-100">매출 현황과 통계를 확인하세요</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/30 transition"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="px-4 py-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period === 'today' ? '오늘' : period === 'week' ? '이번 주' : '이번 달'}
            </button>
          ))}
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
            <DollarSign className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">
              {(todayStats.revenue / 10000).toFixed(0)}만원
            </p>
            <p className="text-sm text-green-100">오늘 매출</p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>전일 대비 +12.5%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-xl">
            <ShoppingBag className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{todayStats.orders}</p>
            <p className="text-sm text-blue-100">주문 건수</p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>전일 대비 +8.3%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-purple-100">
            <BarChart3 className="w-8 h-8 mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {todayStats.avgOrderValue.toLocaleString()}원
            </p>
            <p className="text-sm text-gray-600">평균 주문 금액</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-orange-100">
            <Award className="w-8 h-8 mb-2 text-orange-600" />
            <p className="text-xl font-bold text-gray-900 mb-1">{todayStats.topMenu}</p>
            <p className="text-sm text-gray-600">인기 메뉴</p>
          </div>
        </div>
      </div>

      {/* 시간대별 매출 */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg text-gray-900">시간대별 매출</h3>
          </div>

          <div className="space-y-3">
            {mockHourlySales.map((hourData) => (
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
            <span>피크 시간: {todayStats.peakHour} (35건)</span>
          </div>
        </div>
      </div>

      {/* 메뉴별 판매 순위 */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg text-gray-900">메뉴별 판매 순위</h3>
          </div>

          <div className="space-y-3">
            {mockMenuSales.map((menu, index) => (
              <div
                key={menu.menuId}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    index === 0
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
                      {(menu.revenue / 10000).toFixed(0)}만원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{menu.category}</span>
                    <span className="text-xs text-gray-600">{menu.quantity}개 판매</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일별 매출 추이 */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg text-gray-900">최근 5일 매출</h3>
          </div>

          <div className="space-y-3">
            {mockSalesData.map((day) => (
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
                      style={{
                        width: `${(day.revenue / Math.max(...mockSalesData.map((d) => d.revenue))) * 100}%`,
                      }}
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
                {(mockSalesData.reduce((sum, d) => sum + d.revenue, 0) / mockSalesData.length / 10000).toFixed(0)}만원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 요약 정보 */}
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
                {(weeklyComparison.revenue / 10000).toFixed(0)}만원
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                <TrendingUp className="w-3 h-3" />
                <span>+{weeklyComparison.revenueChange}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-200 mb-1">총 주문</p>
              <p className="text-2xl font-bold">{weeklyComparison.orders}건</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                <TrendingUp className="w-3 h-3" />
                <span>+{weeklyComparison.ordersChange}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-400/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200">일 평균 매출</span>
              <span className="font-bold">
                {(weeklyComparison.revenue / 7 / 10000).toFixed(0)}만원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="px-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">데이터 업데이트</h4>
              <p className="text-sm text-blue-800">
                매출 데이터는 실시간으로 업데이트됩니다. 더 자세한 분석이 필요하시면 엑셀 파일을
                다운로드하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
