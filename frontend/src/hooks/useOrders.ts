import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi, vendorOrdersApi } from '@/lib/api/orders'
import type {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderFilters,
} from '@/lib/api/orders'
import type { ProcessPaymentData } from '@/types'
import { toast } from '@/components/ui/Toast'

// 내 주문 목록 조회
export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersApi.getMy(),
  })
}

// 주문 상세 조회
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
}

// 주문 생성
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('주문이 완료되었습니다')
    },
  })
}

// 주문 취소
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('주문이 취소되었습니다')
    },
  })
}

// 푸드트럭 주문 목록 조회 (운영자)
export function useVendorOrders(truckId: string, filters?: OrderFilters) {
  return useQuery({
    queryKey: ['vendor', 'food-trucks', truckId, 'orders', filters],
    queryFn: () => vendorOrdersApi.getAll(truckId, filters),
    enabled: !!truckId,
    refetchInterval: 30000, // 30초마다 자동 새로고침
  })
}

// 주문 상태 업데이트 (운영자)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      truckId,
      orderId,
      data,
    }: {
      truckId: string
      orderId: string
      data: UpdateOrderStatusRequest
    }) => vendorOrdersApi.updateStatus(truckId, orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['vendor', 'food-trucks', variables.truckId, 'orders'],
      })
      toast.success('주문 상태가 업데이트되었습니다')
    },
  })
}

// 주문 통계 조회 (운영자)
export function useOrderStats(truckId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['vendor', 'food-trucks', truckId, 'orders', 'stats', startDate, endDate],
    queryFn: () => vendorOrdersApi.getStats(truckId, startDate, endDate),
    enabled: !!truckId,
  })
}

// 일별 매출 조회 (운영자)
export function useDailySales(truckId: string, date: string) {
  return useQuery({
    queryKey: ['vendor', 'food-trucks', truckId, 'sales', 'daily', date],
    queryFn: () => vendorOrdersApi.getDailySales(truckId, date),
    enabled: !!truckId && !!date,
  })
}

// 메뉴별 판매 통계 (운영자)
export function useMenuSales(truckId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['vendor', 'food-trucks', truckId, 'sales', 'menu', startDate, endDate],
    queryFn: () => vendorOrdersApi.getMenuSales(truckId, startDate, endDate),
    enabled: !!truckId,
  })
}

// 결제 처리
export function useProcessPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: ProcessPaymentData }) =>
      ordersApi.processPayment(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('결제가 완료되었습니다')
    },
    onError: () => {
      toast.error('결제 처리 중 오류가 발생했습니다')
    },
  })
}

// 결제 취소
export function useCancelPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelPayment(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('결제가 취소되었습니다')
    },
    onError: () => {
      toast.error('결제 취소 중 오류가 발생했습니다')
    },
  })
}
