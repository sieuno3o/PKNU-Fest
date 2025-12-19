import api from './client'
import type { ProcessPaymentData } from '../../types'
import type { Key } from 'react'

// 타입 정의
export interface OrderItem {
  id: Key | null | undefined
  menuItem: any
  menuId: string
  menuName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: number
  pickupNumber?: string
  userId: string
  userName?: string
  userPhone?: string
  truckId?: string
  foodTruckId?: string
  truckName?: string
  foodTruck?: {
    id: string
    name: string
    image?: string
    location?: string
  }
  items?: OrderItem[]
  orderItems?: OrderItem[]  // Backend uses this name
  totalAmount?: number
  totalPrice?: number  // Backend uses this name
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
  paymentId?: string
  paymentMethod?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  paidAt?: string
  orderTime?: string
  pickupTime?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  foodTruckId: string
  items: {
    menuItemId: string
    quantity: number
  }[]
  notes?: string
}

export interface UpdateOrderStatusRequest {
  status: 'preparing' | 'ready' | 'completed' | 'cancelled'
}

export interface OrderFilters {
  status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  truckId?: string
  userId?: string
  startDate?: string
  endDate?: string
}

// 주문 API (고객용)
export const ordersApi = {
  // 내 주문 목록 조회
  getMy: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders')
    return Array.isArray(response.data) ? response.data : (response.data as any).data || []
  },

  // 주문 상세 조회
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`)
    // Handle wrapped response { success: true, data: {...} }
    return (response.data as any).data || response.data
  },

  // 주문 생성
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', data)
    // Handle wrapped response { success: true, data: {...} }
    return (response.data as any).data || response.data
  },

  // 주문 취소 (대기중일 때만)
  cancel: async (id: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/cancel`)
    return response.data
  },

  // 결제 처리
  processPayment: async (id: string, data: ProcessPaymentData): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/payment`, data)
    return response.data
  },

  // 결제 취소
  cancelPayment: async (id: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/cancel-payment`)
    return response.data
  },
}

// 주문 관리 API (운영자용)
export const vendorOrdersApi = {
  // 푸드트럭 주문 목록 조회
  getAll: async (_truckId: string, filters?: OrderFilters): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/vendor/orders`, {
      params: filters,
    })
    return Array.isArray(response.data) ? response.data : (response.data as any).data || []
  },

  // 주문 상태 업데이트
  updateStatus: async (
    _truckId: string,
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> => {
    const response = await api.patch<Order>(
      `/orders/${orderId}/status`,
      data
    )
    // Handle wrapped response
    return (response.data as any).data || response.data
  },

  // 주문 통계 조회
  getStats: async (
    truckId: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> => {
    const response = await api.get(`/vendor/food-trucks/${truckId}/orders/stats`, {
      params: { startDate, endDate },
    })
    return response.data
  },

  // 일별 매출 조회
  getDailySales: async (truckId: string, date: string): Promise<any> => {
    const response = await api.get(`/vendor/food-trucks/${truckId}/sales/daily`, {
      params: { date },
    })
    return response.data
  },

  // 메뉴별 판매 통계
  getMenuSales: async (
    truckId: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> => {
    const response = await api.get(`/vendor/food-trucks/${truckId}/sales/menu`, {
      params: { startDate, endDate },
    })
    return response.data
  },
}
