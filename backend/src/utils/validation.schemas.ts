import { z } from 'zod'

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
})

export const sendStudentVerificationSchema = z.object({
  studentEmail: z.string().email('Invalid email address').refine(
    (email) => email.endsWith('@pknu.ac.kr'),
    { message: 'Must be a PKNU email address (@pknu.ac.kr)' }
  ),
})

export const confirmStudentVerificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

// Event Schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
  isStudentOnly: z.boolean().optional().default(false),
  capacity: z.number().int().positive().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'FULL', 'ONGOING', 'ENDED']).optional(),
  organizer: z.string().optional(),
})

export const updateEventSchema = createEventSchema.partial()

export const eventQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  studentOnly: z.string().transform((val) => val === 'true').optional(),
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  sort: z.enum(['latest', 'popular', 'upcoming']).optional(),
})

// Reservation Schemas
export const createReservationSchema = z.object({
  eventId: z.string().uuid(),
  timeSlotId: z.string().uuid().optional(),
  partySize: z.number().int().min(1).max(4).optional(),
})

// FoodTruck Schemas
export const createFoodTruckSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url().optional(),
})

export const updateFoodTruckSchema = createFoodTruckSchema.partial()

// Menu Schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  available: z.boolean().optional(),
})

export const updateMenuItemSchema = createMenuItemSchema.partial()

// Order Schemas
export const createOrderSchema = z.object({
  foodTruckId: z.string().uuid(),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item is required'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
})

// TimeSlot Schemas
export const createTimeSlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().int().positive().nullable().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type CreateFoodTruckInput = z.infer<typeof createFoodTruckSchema>
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
