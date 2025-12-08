import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi, type EventFilters, type CreateEventRequest, type UpdateEventRequest } from '@/lib/api/events'
import { toast } from '@/components/ui/Toast'

// 행사 목록 조회
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.getAll(filters),
  })
}

// 행사 상세 조회
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  })
}

// 인기 행사 조회
export function usePopularEvents(limit?: number) {
  return useQuery({
    queryKey: ['events', 'popular', limit],
    queryFn: () => eventsApi.getPopular(limit),
  })
}

// 진행중인 행사 조회
export function useOngoingEvents() {
  return useQuery({
    queryKey: ['events', 'ongoing'],
    queryFn: () => eventsApi.getOngoing(),
  })
}

// 다가오는 행사 조회
export function useUpcomingEvents(limit?: number) {
  return useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: () => eventsApi.getUpcoming(limit),
  })
}

// 행사 생성 (관리자)
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('행사가 등록되었습니다')
    },
  })
}

// 행사 수정 (관리자)
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] })
      toast.success('행사가 수정되었습니다')
    },
  })
}

// 행사 삭제 (관리자)
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('행사가 삭제되었습니다')
    },
  })
}
