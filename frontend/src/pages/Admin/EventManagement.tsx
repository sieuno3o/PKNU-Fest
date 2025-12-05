import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Users, X, Check } from 'lucide-react'

interface Event {
  id: string
  title: string
  category: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  currentReservations: number
  status: 'active' | 'scheduled' | 'ended'
  image: string
}

// TODO: 나중에 API에서 가져올 데이터
const mockEvents: Event[] = [
  {
    id: '1',
    title: '아이유 콘서트',
    category: '공연',
    description: '아이유의 특별한 공연',
    date: '2024-12-15',
    time: '19:00',
    location: '대운동장',
    capacity: 300,
    currentReservations: 243,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
  },
  {
    id: '2',
    title: '체험 부스 - AR/VR',
    category: '체험',
    description: '최신 AR/VR 기술 체험',
    date: '2024-12-16',
    time: '14:00',
    location: '공학관',
    capacity: 200,
    currentReservations: 156,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
  },
  {
    id: '3',
    title: '게임 대회',
    category: '대회',
    description: 'e-스포츠 토너먼트',
    date: '2024-12-10',
    time: '14:00',
    location: '학생회관',
    capacity: 150,
    currentReservations: 150,
    status: 'ended',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
  },
]

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'scheduled' | 'ended'>(
    'all'
  )
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    category: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    status: 'scheduled',
  })

  // 필터링
  const filteredEvents = events.filter((event) => {
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
      time: '',
      location: '',
      capacity: 0,
      status: 'scheduled',
    })
    setShowModal(true)
  }

  // 행사 수정
  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData(event)
    setShowModal(true)
  }

  // 행사 삭제
  const handleDelete = (id: string) => {
    if (confirm('정말 이 행사를 삭제하시겠습니까?')) {
      setEvents(events.filter((e) => e.id !== id))
      alert('행사가 삭제되었습니다.')
    }
  }

  // 폼 제출
  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    if (editingEvent) {
      // 수정
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id ? { ...e, ...formData } as Event : e
        )
      )
      alert('행사가 수정되었습니다.')
    } else {
      // 추가
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        ...formData,
        currentReservations: 0,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
      } as Event
      setEvents([newEvent, ...events])
      alert('행사가 추가되었습니다.')
    }

    setShowModal(false)
  }

  const statusConfig = {
    active: { label: '진행중', color: 'bg-green-100 text-green-700' },
    scheduled: { label: '예정', color: 'bg-blue-100 text-blue-700' },
    ended: { label: '종료', color: 'bg-gray-100 text-gray-700' },
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
          {(['all', 'active', 'scheduled', 'ended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedStatus === status
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
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        statusConfig[event.status].color
                      }`}
                    >
                      {statusConfig[event.status].label}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {event.date} {event.time}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시간 *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'active' | 'scheduled' | 'ended',
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">예정</option>
                  <option value="active">진행중</option>
                  <option value="ended">종료</option>
                </select>
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
