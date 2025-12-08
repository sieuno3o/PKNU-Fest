import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  foodTrucksApi,
  menuApi,
  FoodTruckFilters,
  CreateMenuRequest,
  UpdateMenuRequest,
} from '@/lib/api/foodtrucks'
import { toast } from '@/components/ui/Toast'

// 푸드트럭 목록 조회
export function useFoodTrucks(filters?: FoodTruckFilters) {
  return useQuery({
    queryKey: ['food-trucks', filters],
    queryFn: () => foodTrucksApi.getAll(filters),
  })
}

// 푸드트럭 상세 조회
export function useFoodTruck(id: string) {
  return useQuery({
    queryKey: ['food-trucks', id],
    queryFn: () => foodTrucksApi.getById(id),
    enabled: !!id,
  })
}

// 푸드트럭 메뉴 조회
export function useFoodTruckMenu(truckId: string) {
  return useQuery({
    queryKey: ['food-trucks', truckId, 'menu'],
    queryFn: () => foodTrucksApi.getMenu(truckId),
    enabled: !!truckId,
  })
}

// 메뉴 아이템 상세 조회
export function useMenuItem(truckId: string, menuId: string) {
  return useQuery({
    queryKey: ['food-trucks', truckId, 'menu', menuId],
    queryFn: () => foodTrucksApi.getMenuItem(truckId, menuId),
    enabled: !!truckId && !!menuId,
  })
}

// 메뉴 생성 (운영자)
export function useCreateMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ truckId, data }: { truckId: string; data: CreateMenuRequest }) =>
      menuApi.create(truckId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['food-trucks', variables.truckId, 'menu'] })
      toast.success('메뉴가 추가되었습니다')
    },
  })
}

// 메뉴 수정 (운영자)
export function useUpdateMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      truckId,
      menuId,
      data,
    }: {
      truckId: string
      menuId: string
      data: UpdateMenuRequest
    }) => menuApi.update(truckId, menuId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['food-trucks', variables.truckId, 'menu'] })
      toast.success('메뉴가 수정되었습니다')
    },
  })
}

// 메뉴 삭제 (운영자)
export function useDeleteMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ truckId, menuId }: { truckId: string; menuId: string }) =>
      menuApi.delete(truckId, menuId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['food-trucks', variables.truckId, 'menu'] })
      toast.success('메뉴가 삭제되었습니다')
    },
  })
}

// 메뉴 재고 업데이트 (운영자)
export function useUpdateMenuStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ truckId, menuId, stock }: { truckId: string; menuId: string; stock: number }) =>
      menuApi.updateStock(truckId, menuId, stock),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['food-trucks', variables.truckId, 'menu'] })
      toast.success('재고가 업데이트되었습니다')
    },
  })
}

// 메뉴 판매 가능 여부 토글 (운영자)
export function useToggleMenuAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      truckId,
      menuId,
      isAvailable,
    }: {
      truckId: string
      menuId: string
      isAvailable: boolean
    }) => menuApi.toggleAvailability(truckId, menuId, isAvailable),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['food-trucks', variables.truckId, 'menu'] })
    },
  })
}
