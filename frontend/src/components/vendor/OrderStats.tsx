interface OrderStatsProps {
  pending: number
  preparing: number
  ready: number
  todayTotal: number
}

export default function OrderStats({ pending, preparing, ready, todayTotal }: OrderStatsProps) {
  return (
    <div className="p-4 -mt-4">
      <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-4 shadow-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-gray-600">대기</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{preparing}</p>
          <p className="text-xs text-gray-600">조리중</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{ready}</p>
          <p className="text-xs text-gray-600">완료</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {(todayTotal / 10000).toFixed(0)}만
          </p>
          <p className="text-xs text-gray-600">오늘매출</p>
        </div>
      </div>
    </div>
  )
}
