import api from './client'
import type { Reservation } from '@/stores/reservationStore'

// 타입 정의
export interface CreateReservationRequest {
  eventId: string
  partySize?: number
  timeSlotId?: string
}

export interface UpdateReservationRequest {
  partySize?: number
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
    const response = await api.get<Reservation[]>('/reservations')
    // 백엔드가 배열을 직접 반환하는지, ApiResponse로 래핑하는지 확인
    // response.data가 배열이면 그대로, 아니면 response.data.data 사용
    return Array.isArray(response.data) ? response.data : (response.data as any).data || []
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
    const response = await api.delete<Reservation>(`/reservations/${id}`)
    return response.data
  },

  // 예약 체크인 (관리자/QR 스캔)
  checkIn: async (id: string): Promise<Reservation> => {
    const response = await api.post<Reservation>(`/reservations/${id}/checkin`)
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
    // 백엔드가 배열을 직접 반환하는지, ApiResponse로 래핑하는지 확인
    return Array.isArray(response.data) ? response.data : (response.data as any).data || []
  },

  // 행사별 예약 통계 (관리자)
  getStats: async (eventId: string): Promise<any> => {
    const response = await api.get(`/admin/events/${eventId}/reservations/stats`)
    return response.data
  },
}
