import { Filter, GraduationCap } from 'lucide-react'

const categories = ['전체', '공연', '체험', '게임', '토크', '기타']

interface EventsFilterProps {
    selectedCategory: string
    onCategoryChange: (category: string) => void
    showStudentOnly: boolean
    onStudentOnlyChange: (value: boolean) => void
}

export default function EventsFilter({
    selectedCategory,
    onCategoryChange,
    showStudentOnly,
    onStudentOnlyChange,
}: EventsFilterProps) {
    return (
        <div className="px-4 py-4 bg-white border-b">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">카테고리</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">학생 전용만 보기</span>
                </div>
                <button
                    onClick={() => onStudentOnlyChange(!showStudentOnly)}
                    className={`relative w-12 h-6 rounded-full transition ${showStudentOnly ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                >
                    <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showStudentOnly ? 'translate-x-6' : ''
                            }`}
                    />
                </button>
            </div>
        </div>
    )
}
