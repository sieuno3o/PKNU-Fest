import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useOrderStats, useMenuSales, useDailySales } from '@/hooks/useOrders'
import SalesReportHeader from '@/components/vendor/SalesReportHeader'
import PeriodSelector from '@/components/vendor/PeriodSelector'
import SalesStatCards from '@/components/vendor/SalesStatCards'
import HourlySalesChart from '@/components/vendor/HourlySalesChart'
import MenuSalesRanking from '@/components/vendor/MenuSalesRanking'
import DailySalesTrend from '@/components/vendor/DailySalesTrend'
import WeeklySummary from '@/components/vendor/WeeklySummary'

export default function SalesReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')
  const { user } = useAuth()

  // 푸드트럭 ID 가져오기 (VENDOR 역할 사용자의 경우)
  const truckId = (user as any)?.foodTruckId || user?.id

  // 날짜 계산
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // 실제 API에서 데이터 가져오기
  const { data: todayData } = useDailySales(truckId!, today)
  const { data: statsData } = useOrderStats(truckId!, weekAgo, today)
  const { data: menuSalesData } = useMenuSales(truckId!, weekAgo, today)

  // 로딩 상태
  if (!truckId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">푸드트럭 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 데이터 가공
  const todayStats = useMemo(() => ({
    revenue: todayData?.totalRevenue || 0,
    orders: todayData?.totalOrders || 0,
    avgOrderValue: todayData?.avgOrderValue || 0,
    topMenu: menuSalesData?.[0]?.menuName || '-',
  }), [todayData, menuSalesData])

  const weeklyComparison = useMemo(() => ({
    revenue: statsData?.totalRevenue || 0,
    revenueChange: 12.5,
    orders: statsData?.totalOrders || 0,
    ordersChange: 8.3,
  }), [statsData])

  // Mock 시간대별 데이터
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

  // Mock 일별 데이터
  const mockSalesData = [
    { date: '2024-12-06', revenue: 450000, orders: 87, avgOrderValue: 5172 },
    { date: '2024-12-05', revenue: 520000, orders: 95, avgOrderValue: 5474 },
    { date: '2024-12-04', revenue: 380000, orders: 72, avgOrderValue: 5278 },
    { date: '2024-12-03', revenue: 490000, orders: 89, avgOrderValue: 5506 },
    { date: '2024-12-02', revenue: 410000, orders: 78, avgOrderValue: 5256 },
  ]

  const handleExportExcel = () => {
    alert('엑셀 다운로드 기능은 곧 구현될 예정입니다.')
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <SalesReportHeader onExportClick={handleExportExcel} />
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      <SalesStatCards {...todayStats} />
      <HourlySalesChart data={mockHourlySales} peakHour="13:00" />
      <MenuSalesRanking menuSalesData={menuSalesData} />
      <DailySalesTrend data={mockSalesData} />
      <WeeklySummary {...weeklyComparison} />
    </div>
  )
}
