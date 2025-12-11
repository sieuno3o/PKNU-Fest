import { useState, useMemo } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import EventsHeader from '@/components/events/EventsHeader'
import EventsFilter from '@/components/events/EventsFilter'
import EventListCard from '@/components/events/EventListCard'

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showStudentOnly, setShowStudentOnly] = useState(false)

  const { data: events, isLoading, error } = useEvents({
    category: selectedCategory !== '전체' ? selectedCategory : undefined,
    search: searchQuery || undefined,
    requiresStudentVerification: showStudentOnly || undefined,
  })

  const filteredEvents = useMemo(() => {
    if (!events) return []
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === '전체' || event.category === selectedCategory
      const matchesStudentFilter = !showStudentOnly || event.requiresStudentVerification
      return matchesSearch && matchesCategory && matchesStudentFilter
    })
  }, [events, searchQuery, selectedCategory, showStudentOnly])

  return (
    <div className="pb-4">
      <EventsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <EventsFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showStudentOnly={showStudentOnly}
        onStudentOnlyChange={setShowStudentOnly}
      />

      <div className="px-4 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-blue-600">{filteredEvents.length}</span>개의 행사
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {error && (
        <div className="mx-4 my-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">데이터를 불러올 수 없습니다</h3>
              <p className="text-sm text-red-800">
                {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="px-4 py-4 space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventListCard key={event.id} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
