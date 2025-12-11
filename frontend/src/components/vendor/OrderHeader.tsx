import { Bell } from 'lucide-react'

interface OrderHeaderProps {
  pendingCount: number
}

export default function OrderHeader({ pendingCount }: OrderHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">주문 관리</h1>
          <p className="text-green-100">실시간으로 주문을 확인하고 처리하세요</p>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
