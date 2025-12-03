// User Types
export type UserRole = 'USER' | 'ADMIN' | 'VENDOR'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  isStudentVerified: boolean
  studentEmail?: string
  verified: boolean
  createdAt: string
  updatedAt: string
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface StudentVerificationRequest {
  studentEmail: string
}

export interface StudentVerificationConfirm {
  code: string
}

// Event Types
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'FULL' | 'ONGOING' | 'ENDED'

export interface Event {
  id: string
  title: string
  description?: string
  category: string
  location: string
  latitude: number
  longitude: number
  thumbnail?: string
  images?: string[]
  isStudentOnly: boolean
  capacity?: number | null
  status: EventStatus
  organizer?: string
  createdAt: string
  updatedAt: string
  timeSlots?: TimeSlot[]
  _count?: {
    reservations: number
  }
}

export interface CreateEventData {
  title: string
  description?: string
  category: string
  location: string
  latitude: number
  longitude: number
  thumbnail?: string
  images?: string[]
  isStudentOnly?: boolean
  capacity?: number | null
  status?: EventStatus
  organizer?: string
}

export interface EventFilters {
  category?: string
  search?: string
  startDate?: string
  endDate?: string
  studentOnly?: boolean
  page?: number
  limit?: number
  sort?: 'latest' | 'popular' | 'upcoming'
}

export interface EventsResponse {
  events: Event[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// TimeSlot Types
export interface TimeSlot {
  id: string
  eventId: string
  startTime: string
  endTime: string
  capacity?: number | null
  reserved: number
  createdAt: string
  updatedAt: string
}

export interface CreateTimeSlotData {
  startTime: string
  endTime: string
  capacity?: number | null
}

// Reservation Types
export type ReservationStatus = 'CONFIRMED' | 'CHECKED_IN' | 'NO_SHOW' | 'CANCELLED'

export interface Reservation {
  id: string
  userId: string
  eventId: string
  timeSlotId?: string
  partySize?: number
  status: ReservationStatus
  qrCode: string
  checkedInAt?: string
  createdAt: string
  updatedAt: string
  event?: Event
  timeSlot?: TimeSlot
  user?: Partial<User>
}

export interface CreateReservationData {
  eventId: string
  timeSlotId?: string
  partySize?: number
}

// FoodTruck Types
export interface FoodTruck {
  id: string
  name: string
  description?: string
  location: string
  latitude: number
  longitude: number
  imageUrl?: string
  isOpen: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
  menu?: MenuItem[]
}

export interface CreateFoodTruckData {
  name: string
  description?: string
  location: string
  latitude: number
  longitude: number
  imageUrl?: string
}

// MenuItem Types
export interface MenuItem {
  id: string
  foodTruckId: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMenuItemData {
  name: string
  description?: string
  price: number
  imageUrl?: string
  available?: boolean
}

// Order Types
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  userId: string
  foodTruckId: string
  pickupNumber?: string
  totalAmount: number
  status: OrderStatus
  paymentId?: string
  createdAt: string
  updatedAt: string
  user?: Partial<User>
  foodTruck?: FoodTruck
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  menuItemId: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
  menuItem?: MenuItem
}

export interface CreateOrderData {
  foodTruckId: string
  items: {
    menuItemId: string
    quantity: number
  }[]
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
