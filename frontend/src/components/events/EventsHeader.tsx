import { Search } from 'lucide-react'

interface EventsHeaderProps {
    searchQuery: string
    onSearchChange: (query: string) => void
}

export default function EventsHeader({ searchQuery, onSearchChange }: EventsHeaderProps) {
    return (
        <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">행사 목록</h1>
                <p className="text-blue-100">PKNU 2025 봄 축제 전체 프로그램</p>
            </div>

            <div className="px-4 py-4 bg-white border-b">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="행사 검색..."
                    />
                </div>
            </div>
        </>
    )
}
