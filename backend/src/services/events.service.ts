import prisma from '../utils/prisma'
import { NotFoundError, ForbiddenError } from '../utils/error.util'
import { CreateEventInput, UpdateEventInput } from '../utils/validation.schemas'

export class EventsService {
  async createEvent(data: CreateEventInput) {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        thumbnail: data.thumbnail,
        images: data.images || [],
        isStudentOnly: data.isStudentOnly || false,
        capacity: data.capacity,
        status: data.status || 'DRAFT',
        organizer: data.organizer,
      },
    })

    return event
  }

  async getEvents(filters: {
    category?: string
    search?: string
    startDate?: string
    endDate?: string
    studentOnly?: boolean
    page?: number
    limit?: number
    sort?: 'latest' | 'popular' | 'upcoming'
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.startDate || filters.endDate) {
      where.startTime = {}
      if (filters.startDate) {
        where.startTime.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.startTime.lte = new Date(filters.endDate)
      }
    }

    if (filters.studentOnly !== undefined) {
      where.isStudentOnly = filters.studentOnly
    }

    let orderBy: any = { createdAt: 'desc' }
    if (filters.sort === 'upcoming') {
      orderBy = { startTime: 'asc' }
    } else if (filters.sort === 'popular') {
      // For now, sort by reservation count would require a complex query
      // We'll keep it simple for the prototype
      orderBy = { createdAt: 'desc' }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ])

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getEvent(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        timeSlots: {
          orderBy: { startTime: 'asc' },
        },
        _count: {
          select: { reservations: true },
        },
      },
    })

    if (!event) {
      throw new NotFoundError('Event not found')
    }

    return event
  }

  async updateEvent(id: string, data: UpdateEventInput) {
    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...data,
      },
    })

    return updatedEvent
  }

  async deleteEvent(id: string) {
    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      throw new NotFoundError('Event not found')
    }

    await prisma.event.delete({ where: { id } })

    return { message: 'Event deleted successfully' }
  }

  async getEventLocations() {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        latitude: true,
        longitude: true,
        category: true,
        isStudentOnly: true,
      },
    })

    return events
  }

  async createTimeSlot(eventId: string, data: { startTime: string; endTime: string; capacity?: number | null }) {
    const event = await prisma.event.findUnique({ where: { id: eventId } })

    if (!event) {
      throw new NotFoundError('Event not found')
    }

    const timeSlot = await prisma.timeSlot.create({
      data: {
        eventId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        capacity: data.capacity,
      },
    })

    return timeSlot
  }

  async getTimeSlots(eventId: string) {
    const timeSlots = await prisma.timeSlot.findMany({
      where: { eventId },
      orderBy: { startTime: 'asc' },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })

    return timeSlots
  }
}
