import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  reservationsApi,
  CreateReservationRequest,
  UpdateReservationRequest,
  ReservationFilters,
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
      toast.success('예약이 완료되었습니다')
    },
  })
}

// 예약 수정
export function useUpdateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationRequest }) =>
      reservationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.id] })
      toast.success('예약이 수정되었습니다')
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
      toast.success('예약이 취소되었습니다')
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
