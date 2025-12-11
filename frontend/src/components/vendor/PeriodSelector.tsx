interface PeriodSelectorProps {
    selectedPeriod: 'today' | 'week' | 'month'
    onPeriodChange: (period: 'today' | 'week' | 'month') => void
}

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
    return (
        <div className="px-4 py-4">
            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
                {(['today', 'week', 'month'] as const).map((period) => (
                    <button
                        key={period}
                        onClick={() => onPeriodChange(period)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${selectedPeriod === period
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {period === 'today' ? '오늘' : period === 'week' ? '이번 주' : '이번 달'}
                    </button>
                ))}
            </div>
        </div>
    )
}
