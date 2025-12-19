import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  reservationsApi,
  type CreateReservationRequest,
  type UpdateReservationRequest,
  type ReservationFilters,
} from '@/lib/api/reservations'
import { toast } from '@/components/ui/Toast'

// 내 예약 목록 조회
export function useMyReservations() {
  return useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: () => reservationsApi.getMy(),
  })
}

// 예약 상세 조회
export function useReservation(id: string) {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
  })
}

// 예약 생성
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReservationRequest) => reservationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// 예약 상태 변경 (관리자용 통합 훅)
export function useUpdateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReservationRequest }) => {
      const status = data.status?.toUpperCase()

      // 상태에 따라 적절한 API 호출
      if (status === 'CONFIRMED') {
        return reservationsApi.approve(id)
      } else if (status === 'REJECTED') {
        return reservationsApi.reject(id)
      } else if (status === 'CHECKED_IN' || status === 'CHECKED-IN') {
        return reservationsApi.checkIn(id)
      } else if (status === 'CANCELLED') {
        return reservationsApi.cancel(id)
      }

      throw new Error(`Unsupported status: ${data.status}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reservations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('상태가 변경되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '상태 변경에 실패했습니다')
    },
  })
}

// 예약 취소
export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reservationsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// 예약 체크인 (관리자)
export function useCheckInReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reservationsApi.checkIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      toast.success('체크인이 완료되었습니다')
    },
  })
}

// 예약 신청 수락 (관리자 - 선정 방식)
export function useApproveReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reservationsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reservations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('신청이 수락되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '수락에 실패했습니다')
    },
  })
}

// 예약 신청 거절 (관리자 - 선정 방식)
export function useRejectReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reservationsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reservations'] })
      toast.success('신청이 거절되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '거절에 실패했습니다')
    },
  })
}

// QR 코드 조회
export function useReservationQRCode(id: string) {
  return useQuery({
    queryKey: ['reservations', id, 'qr-code'],
    queryFn: () => reservationsApi.getQRCode(id),
    enabled: !!id,
  })
}

// 모든 예약 조회 (관리자)
export function useAllReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: ['admin', 'reservations', filters],
    queryFn: () => reservationsApi.getAll(filters),
  })
}

// 행사별 예약 통계 (관리자)
export function useReservationStats(eventId: string) {
  return useQuery({
    queryKey: ['admin', 'events', eventId, 'reservations', 'stats'],
    queryFn: () => reservationsApi.getStats(eventId),
    enabled: !!eventId,
  })
}

