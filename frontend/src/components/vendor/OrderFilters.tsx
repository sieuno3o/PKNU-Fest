import { Clock, Package, CheckCircle } from 'lucide-react'

type OrderStatus = 'all' | 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

interface OrderFiltersProps {
  selectedStatus: OrderStatus
  onStatusChange: (status: OrderStatus) => void
}

const statusConfig: Record<string, { label: string; icon: any }> = {
  PENDING: { label: '대기중', icon: Clock },
  PREPARING: { label: '조리중', icon: Package },
  READY: { label: '완료', icon: CheckCircle },
  COMPLETED: { label: '픽업완료', icon: CheckCircle },
}

export default function OrderFilters({ selectedStatus, onStatusChange }: OrderFiltersProps) {
  const statuses: OrderStatus[] = ['all', 'PENDING', 'PREPARING', 'READY', 'COMPLETED']

  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2 overflow-x-auto">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${selectedStatus === status
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {status === 'all' ? '전체' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>
    </div>
  )
}
