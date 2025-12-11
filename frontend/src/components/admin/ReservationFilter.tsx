interface ReservationFilterProps {
  selectedStatus: 'all' | 'confirmed' | 'cancelled' | 'checked-in' | 'no-show'
  onStatusChange: (status: 'all' | 'confirmed' | 'cancelled' | 'checked-in' | 'no-show') => void
}

const statusConfig = {
  confirmed: { label: '확정' },
  'checked-in': { label: '체크인' },
  cancelled: { label: '취소' },
  'no-show': { label: '노쇼' },
}

export default function ReservationFilter({ selectedStatus, onStatusChange }: ReservationFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {(['all', 'confirmed', 'checked-in', 'cancelled', 'no-show'] as const).map(
        (status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedStatus === status
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {status === 'all'
              ? '전체'
              : statusConfig[status as keyof typeof statusConfig].label}
          </button>
        )
      )}
    </div>
  )
}
