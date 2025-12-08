import api from './client'
import { Reservation } from '@/stores/reservationStore'

// 타입 정의
export interface CreateReservationRequest {
  eventId: string
  attendees: number
}

export interface UpdateReservationRequest {
  attendees?: number
  status?: 'confirmed' | 'cancelled' | 'checked-in' | 'no-show'
}

export interface ReservationFilters {
  status?: 'confirmed' | 'cancelled' | 'checked-in' | 'no-show'
  eventId?: string
  userId?: string
  startDate?: string
  endDate?: string
}

// 예약 API
export const reservationsApi = {
  // 내 예약 목록 조회
  getMy: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/reservations/my')
    return response.data
  },

  // 예약 상세 조회
  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`)
    return response.data
  },

  // 예약 생성
  create: async (data: CreateReservationRequest): Promise<Reservation> => {
    const response = await api.post<Reservation>('/reservations', data)
    return response.data
  },

  // 예약 수정
  update: async (id: string, data: UpdateReservationRequest): Promise<Reservation> => {
    const response = await api.patch<Reservation>(`/reservations/${id}`, data)
    return response.data
  },

  // 예약 취소
  cancel: async (id: string): Promise<Reservation> => {
    const response = await api.post<Reservation>(`/reservations/${id}/cancel`)
    return response.data
  },

  // 예약 체크인 (관리자/QR 스캔)
  checkIn: async (id: string): Promise<Reservation> => {
    const response = await api.post<Reservation>(`/reservations/${id}/check-in`)
    return response.data
  },

  // QR 코드 조회
  getQRCode: async (id: string): Promise<string> => {
    const response = await api.get<{ qrCode: string }>(`/reservations/${id}/qr-code`)
    return response.data.qrCode
  },

  // 모든 예약 조회 (관리자)
  getAll: async (filters?: ReservationFilters): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/admin/reservations', { params: filters })
    return response.data
  },

  // 행사별 예약 통계 (관리자)
  getStats: async (eventId: string): Promise<any> => {
    const response = await api.get(`/admin/events/${eventId}/reservations/stats`)
    return response.data
  },
}
