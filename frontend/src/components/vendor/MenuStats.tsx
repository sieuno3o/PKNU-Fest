interface MenuStatsProps {
  total: number
  available: number
  outOfStock: number
}

export default function MenuStats({ total, available, outOfStock }: MenuStatsProps) {
  return (
    <div className="p-4 -mt-4">
      <div className="grid grid-cols-3 gap-3 bg-white rounded-2xl p-4 shadow-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-600">전체 메뉴</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{available}</p>
          <p className="text-xs text-gray-600">판매중</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
          <p className="text-xs text-gray-600">품절</p>
        </div>
      </div>
    </div>
  )
}
