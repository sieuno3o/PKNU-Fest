import { Search, Download } from 'lucide-react'

interface ReservationSearchBarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    onExportClick: () => void
}

export default function ReservationSearchBar({ searchQuery, onSearchChange, onExportClick }: ReservationSearchBarProps) {
    return (
        <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="이름, 행사명, 이메일 검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <button
                onClick={onExportClick}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-1"
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
    )
}
