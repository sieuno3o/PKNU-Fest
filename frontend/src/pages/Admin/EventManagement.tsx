import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Users, X, Check, Loader2 } from 'lucide-react'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents'
import type { Event, CreateEventRequest } from '@/lib/api/events'
import { toast } from '@/components/ui/Toast'

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
        // 수정
        await updateEvent.mutateAsync({
          id: editingEvent.id,
          data: formData,
        })
      } else {
        // 추가
        await createEvent.mutateAsync(formData as CreateEventRequest)
      }
      setShowModal(false)
    } catch (error) {
      toast.error(editingEvent ? '행사 수정에 실패했습니다.' : '행사 추가에 실패했습니다.')
    }
  }

  const statusConfig = {
    ongoing: { label: '진행중', color: 'bg-green-100 text-green-700' },
    upcoming: { label: '예정', color: 'bg-blue-100 text-blue-700' },
    ended: { label: '종료', color: 'bg-gray-100 text-gray-700' },
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">행사 관리</h1>
          <p className="text-blue-100">축제 행사를 등록하고 관리하세요</p>
        </div>
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">행사 관리</h1>
          <p className="text-blue-100">축제 행사를 등록하고 관리하세요</p>
        </div>
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
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">행사 관리</h1>
        <p className="text-blue-100">축제 행사를 등록하고 관리하세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="행사 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-1"
          >
            <Plus className="w-5 h-5" />
            추가
          </button>
        </div>

        <div className="flex gap-2">
          {(['all', 'ongoing', 'upcoming', 'ended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status === 'all' ? '전체' : statusConfig[status].label}
            </button>
          ))}
        </div>
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
            <div key={event.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex gap-4 p-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                      <span className="text-xs text-gray-600">{event.category}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${statusConfig[event.status].color
                        }`}
                    >
                      {statusConfig[event.status].label}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {event.date} {event.startTime} - {event.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.currentReservations}/{event.capacity}명
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 행사 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingEvent ? '행사 수정' : '새 행사 추가'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  행사 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 아이유 콘서트"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 공연, 체험, 대회"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="행사 설명"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간 *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">장소 *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 대운동장"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정원</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="최대 인원"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresStudentVerification}
                    onChange={(e) =>
                      setFormData({ ...formData, requiresStudentVerification: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">학생 인증 필요</span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingEvent ? '수정 완료' : '추가 완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
