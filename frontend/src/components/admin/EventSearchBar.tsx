import { Search, Plus } from 'lucide-react'

interface EventSearchBarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    onAddClick: () => void
}

export default function EventSearchBar({ searchQuery, onSearchChange, onAddClick }: EventSearchBarProps) {
    return (
        <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="행사 검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={onAddClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-1"
            >
                <Plus className="w-5 h-5" />
                추가
            </button>
        </div>
    )
}
