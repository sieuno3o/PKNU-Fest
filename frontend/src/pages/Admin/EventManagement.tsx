import { useState } from 'react'
import { Calendar, Loader2, X } from 'lucide-react'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents'
import type { Event, CreateEventRequest } from '@/lib/api/events'
import { toast } from '@/components/ui/Toast'
import EventManagementHeader from '@/components/admin/EventManagementHeader'
import EventSearchBar from '@/components/admin/EventSearchBar'
import EventFilter from '@/components/admin/EventFilter'
import EventCard from '@/components/admin/EventCard'
import EventFormModal from '@/components/admin/EventFormModal'

export default function EventManagement() {
  // API Hooks
  const { data: events, isLoading, error } = useEvents()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  // Local State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>(
    'all'
  )
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Partial<CreateEventRequest>>({
    title: '',
    category: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
    requiresStudentVerification: false,
  })

  // 필터링
  const filteredEvents = (events || []).filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // 새 행사 추가
  const handleCreate = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      category: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: 0,
      requiresStudentVerification: false,
    })
    setShowModal(true)
  }

  // 행사 수정
  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      category: event.category,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      capacity: event.capacity,
      requiresStudentVerification: event.requiresStudentVerification,
      image: event.image,
      tags: event.tags,
    })
    setShowModal(true)
  }

  // 행사 삭제
  const handleDelete = async (id: string) => {
    if (confirm('정말 이 행사를 삭제하시겠습니까?')) {
      try {
        await deleteEvent.mutateAsync(id)
      } catch (error) {
        toast.error('행사 삭제에 실패했습니다.')
      }
    }
  }

  // 폼 제출
  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.location) {
      toast.error('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({
          id: editingEvent.id,
          data: formData,
        })
      } else {
        await createEvent.mutateAsync(formData as CreateEventRequest)
      }
      setShowModal(false)
    } catch (error) {
      toast.error(editingEvent ? '행사 수정에 실패했습니다.' : '행사 추가에 실패했습니다.')
    }
  }

  const handleFormChange = (field: keyof CreateEventRequest, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 pb-20">
        <EventManagementHeader />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full bg-gray-50 pb-20">
        <EventManagementHeader />
        <div className="flex flex-col items-center justify-center py-20">
          <X className="w-20 h-20 text-red-500 mb-4" />
          <p className="text-gray-700 text-lg font-medium">행사 목록을 불러오는데 실패했습니다.</p>
          <p className="text-gray-500 text-sm mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <EventManagementHeader />

      {/* 검색 및 필터 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <EventSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={handleCreate}
        />
        <EventFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* 행사 목록 */}
      <div className="p-4 space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">행사가 없습니다</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* 행사 추가/수정 모달 */}
      <EventFormModal
        isOpen={showModal}
        isEditing={!!editingEvent}
        formData={formData}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
      />
    </div>
  )
}
