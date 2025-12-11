interface EventFilterProps {
    selectedStatus: 'all' | 'upcoming' | 'ongoing' | 'ended'
    onStatusChange: (status: 'all' | 'upcoming' | 'ongoing' | 'ended') => void
}

const statusConfig = {
    ongoing: { label: '진행중' },
    upcoming: { label: '예정' },
    ended: { label: '종료' },
}

export default function EventFilter({ selectedStatus, onStatusChange }: EventFilterProps) {
    return (
        <div className="flex gap-2">
            {(['all', 'ongoing', 'upcoming', 'ended'] as const).map((status) => (
                <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {status === 'all' ? '전체' : statusConfig[status].label}
                </button>
            ))}
        </div>
    )
}
