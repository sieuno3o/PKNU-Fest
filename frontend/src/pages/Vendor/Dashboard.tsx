import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDailySales, useVendorOrders } from '@/hooks/useOrders'
import { useFoodTruckMenu } from '@/hooks/useFoodTrucks'

export default function VendorDashboard() {
  const { user } = useAuth()
  const truckId = user?.foodTruckId || user?.id
  const today = new Date().toISOString().split('T')[0]

  // 실제 API에서 데이터 가져오기
  const { data: todayData } = useDailySales(truckId!, today)
  const { data: ordersData } = useVendorOrders(truckId!, { status: 'PENDING,PREPARING,READY' })
  const { data: menuData } = useFoodTruckMenu(truckId!)

  const stats = {
    todayOrders: todayData?.totalOrders || 0,
    todayRevenue: todayData?.totalRevenue || 0,
    pendingOrders: ordersData?.filter((o: any) => o.status === 'PENDING').length || 0,
    preparingOrders: ordersData?.filter((o: any) => o.status === 'PREPARING').length || 0,
    readyOrders: ordersData?.filter((o: any) => o.status === 'READY').length || 0,
    menuItems: menuData?.length || 0,
    popularMenu: '-',
  }

  const quickLinks = [
    {
      title: '메뉴 관리',
      description: '메뉴 등록 및 수정',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      path: '/vendor/menu',
      badge: stats.menuItems,
    },
    {
      title: '주문 관리',
      description: '실시간 주문 확인',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-500',
      path: '/vendor/orders',
      badge: stats.pendingOrders,
    },
    {
      title: '매출 리포트',
      description: '매출 통계 및 분석',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      path: '/vendor/sales',
    },
    {
      title: '설정',
      description: '푸드트럭 설정',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      path: '/profile',
    },
  ]

  const recentOrders = [
    {
      id: 'ord-101',
      orderNumber: 1,
      customer: '김철수',
      items: '치즈 떡볶이 x2, 콜라 x2',
      amount: 14000,
      status: 'pending',
      time: '방금 전',
    },
    {
      id: 'ord-102',
      orderNumber: 2,
      customer: '이영희',
      items: '핫도그 x1, 콜라 x1',
      amount: 5000,
      status: 'preparing',
      time: '3분 전',
    },
    {
      id: 'ord-103',
      orderNumber: 3,
      customer: '박민수',
      items: '타코야키 x1',
      amount: 4000,
      status: 'ready',
      time: '5분 전',
    },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    ready: 'bg-green-100 text-green-700',
  }

  const statusLabels = {
    pending: '대기중',
    preparing: '조리중',
    ready: '완료',
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">푸드트럭 운영</h1>
            <p className="text-orange-100 text-sm">김밥천국 푸드트럭</p>
          </div>
          <Link
            to="/profile"
            className="relative w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition"
          >
            <Bell className="w-6 h-6" />
            {stats.pendingOrders > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                {stats.pendingOrders}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 오늘의 매출 하이라이트 */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-100 mb-1">오늘의 매출</p>
              <p className="text-3xl font-bold">{(stats.todayRevenue / 10000).toFixed(0)}만원</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-green-100 mb-1">주문 건수</p>
              <p className="text-xl font-bold">{stats.todayOrders}건</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 현황 */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">실시간 주문 현황</h3>
          <div className="grid grid-cols-3 gap-4">
            <Link
              to="/vendor/orders"
              className="text-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition"
            >
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-600">대기중</p>
            </Link>
            <Link
              to="/vendor/orders"
              className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <p className="text-2xl font-bold text-blue-600">{stats.preparingOrders}</p>
              <p className="text-xs text-gray-600">조리중</p>
            </Link>
            <Link
              to="/vendor/orders"
              className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <p className="text-2xl font-bold text-green-600">{stats.readyOrders}</p>
              <p className="text-xs text-gray-600">완료</p>
            </Link>
          </div>
        </div>
      </div>

      {/* 대기중인 주문 알림 */}
      {stats.pendingOrders > 0 && (
        <div className="px-4 mb-6">
          <Link
            to="/vendor/orders"
            className="block bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-yellow-100">새로운 주문</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}건 대기중</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        </div>
      )}

      {/* 빠른 링크 */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">관리 메뉴</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {link.badge && (
                <span className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {link.badge}
                </span>
              )}
              <div
                className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
              <p className="text-xs text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">최근 주문</h2>
          <Link
            to="/vendor/orders"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            전체보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              to="/vendor/orders"
              className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center font-bold text-orange-600">
                    {order.orderNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{order.customer}</h4>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    statusColors[order.status as keyof typeof statusColors]
                  }`}
                >
                  {statusLabels[order.status as keyof typeof statusLabels]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{order.items}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">총 금액</span>
                <span className="font-bold text-orange-600">{order.amount.toLocaleString()}원</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 인기 메뉴 */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-purple-100">오늘의 인기 메뉴</p>
              <p className="text-xl font-bold">{stats.popularMenu}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>재고 확인이 필요합니다</span>
          </div>
        </div>
      </div>
    </div>
  )
}
