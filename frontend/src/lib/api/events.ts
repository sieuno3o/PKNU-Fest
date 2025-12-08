import api from './client'

// 타입 정의
export interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  currentReservations: number
  image: string
  tags: string[]
  requiresStudentVerification: boolean
  status: 'upcoming' | 'ongoing' | 'ended'
  organizerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  title: string
  description: string
  category: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  image?: string
  tags?: string[]
  requiresStudentVerification?: boolean
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventFilters {
  category?: string
  date?: string
  status?: 'upcoming' | 'ongoing' | 'ended'
  search?: string
  requiresStudentVerification?: boolean
}

// 행사 API
export const eventsApi = {
  // 행사 목록 조회
  getAll: async (filters?: EventFilters): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events', { params: filters })
    return response.data
  },

  // 행사 상세 조회
  getById: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`)
    return response.data
  },

  // 행사 생성 (관리자)
  create: async (data: CreateEventRequest): Promise<Event> => {
    const response = await api.post<Event>('/events', data)
    return response.data
  },

  // 행사 수정 (관리자)
  update: async (id: string, data: UpdateEventRequest): Promise<Event> => {
    const response = await api.patch<Event>(`/events/${id}`, data)
    return response.data
  },

  // 행사 삭제 (관리자)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`)
  },

  // 인기 행사 조회
  getPopular: async (limit: number = 5): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/popular', { params: { limit } })
    return response.data
  },

  // 진행중인 행사 조회
  getOngoing: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/ongoing')
    return response.data
  },

  // 다가오는 행사 조회
  getUpcoming: async (limit?: number): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/upcoming', { params: { limit } })
    return response.data
  },
}
