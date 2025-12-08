import api from './client'

// 타입 정의
export interface FoodTruck {
  id: string
  name: string
  description: string
  category: string
  image: string
  location: string
  latitude?: number
  longitude?: number
  operatingHours: string
  phone: string
  rating: number
  reviewCount: number
  isOpen: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Menu {
  id: string
  truckId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  stock?: number
}

export interface CreateMenuRequest {
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable?: boolean
  stock?: number
}

export interface UpdateMenuRequest extends Partial<CreateMenuRequest> { }

export interface FoodTruckFilters {
  category?: string
  isOpen?: boolean
  search?: string
}

// 푸드트럭 API
export const foodTrucksApi = {
  // 푸드트럭 목록 조회
  getAll: async (filters?: FoodTruckFilters): Promise<FoodTruck[]> => {
    const response = await api.get<FoodTruck[]>('/foodtrucks', { params: filters })
    return Array.isArray(response.data) ? response.data : (response.data as any).data || []
  },

  // 푸드트럭 상세 조회
  getById: async (id: string): Promise<FoodTruck> => {
    const response = await api.get<FoodTruck>(`/foodtrucks/${id}`)
    return response.data
  },

  // 푸드트럭 메뉴 조회
  getMenu: async (truckId: string): Promise<Menu[]> => {
    const response = await api.get<Menu[]>(`/foodtrucks/${truckId}/menu`)
    return response.data
  },

  // 메뉴 아이템 상세 조회
  getMenuItem: async (truckId: string, menuId: string): Promise<Menu> => {
    const response = await api.get<Menu>(`/foodtrucks/${truckId}/menu/${menuId}`)
    return response.data
  },
}

// 메뉴 관리 API (운영자)
export const menuApi = {
  // 메뉴 생성
  create: async (truckId: string, data: CreateMenuRequest): Promise<Menu> => {
    const response = await api.post<Menu>(`/vendor/food-trucks/${truckId}/menu`, data)
    return response.data
  },

  // 메뉴 수정
  update: async (truckId: string, menuId: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await api.patch<Menu>(
      `/vendor/food-trucks/${truckId}/menu/${menuId}`,
      data
    )
    return response.data
  },

  // 메뉴 삭제
  delete: async (truckId: string, menuId: string): Promise<void> => {
    await api.delete(`/vendor/food-trucks/${truckId}/menu/${menuId}`)
  },

  // 메뉴 재고 업데이트
  updateStock: async (truckId: string, menuId: string, stock: number): Promise<Menu> => {
    const response = await api.patch<Menu>(
      `/vendor/food-trucks/${truckId}/menu/${menuId}/stock`,
      { stock }
    )
    return response.data
  },

  // 메뉴 판매 가능 여부 토글
  toggleAvailability: async (
    truckId: string,
    menuId: string,
    isAvailable: boolean
  ): Promise<Menu> => {
    const response = await api.patch<Menu>(
      `/vendor/food-trucks/${truckId}/menu/${menuId}/availability`,
      { isAvailable }
    )
    return response.data
  },
}
