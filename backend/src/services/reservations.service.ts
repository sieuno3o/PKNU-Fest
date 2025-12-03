import prisma from '../utils/prisma'
import QRCode from 'qrcode'
import { randomUUID } from 'crypto'
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/error.util'
import { CreateReservationInput } from '../utils/validation.schemas'

export class ReservationsService {
  async createReservation(userId: string, data: CreateReservationInput) {
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: data.eventId } })

    if (!event) {
      throw new NotFoundError('Event not found')
    }

    // Check if event is student-only
    if (event.isStudentOnly) {
      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user) {
        throw new NotFoundError('User not found')
      }

      if (!user.isStudentVerified) {
        throw new ForbiddenError('This event is for verified students only. Please verify your student status.')
      }
    }

    // Check event capacity if no time slot and capacity is set
    if (!data.timeSlotId && event.capacity !== null) {
      const reservationCount = await prisma.reservation.count({
        where: {
          eventId: data.eventId,
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        },
      })

      if (reservationCount >= event.capacity) {
        throw new BadRequestError('Event is fully booked')
      }
    }

    // If time slot specified, check time slot capacity
    if (data.timeSlotId) {
      const timeSlot = await prisma.timeSlot.findUnique({
        where: { id: data.timeSlotId },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      })

      if (!timeSlot) {
        throw new NotFoundError('Time slot not found')
      }

      // Only check capacity if it's set
      if (timeSlot.capacity !== null && timeSlot._count.reservations >= timeSlot.capacity) {
        throw new BadRequestError('Time slot is fully booked')
      }
    }

    // Check if user already has a reservation for this event
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId,
        eventId: data.eventId,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      },
    })

    if (existingReservation) {
      throw new BadRequestError('You already have a reservation for this event')
    }

    // Generate UUID for reservation
    const reservationId = randomUUID()

    // Generate QR code data
    const qrData = JSON.stringify({
      reservationId,
      userId,
      eventId: data.eventId,
    })

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrData)

    // Create reservation with QR code
    const reservation = await prisma.reservation.create({
      data: {
        id: reservationId,
        userId,
        eventId: data.eventId,
        timeSlotId: data.timeSlotId,
        partySize: data.partySize,
        status: 'CONFIRMED',
        qrCode: qrCodeDataURL,
      },
      include: {
        event: true,
        timeSlot: true,
      },
    })

    return reservation
  }

  async getReservations(userId: string, filters?: { status?: string }) {
    const where: any = { userId }

    if (filters?.status) {
      where.status = filters.status
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        event: true,
        timeSlot: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reservations
  }

  async getReservation(userId: string, id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        event: true,
        timeSlot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!reservation) {
      throw new NotFoundError('Reservation not found')
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenError('You do not have access to this reservation')
    }

    return reservation
  }

  async cancelReservation(userId: string, id: string) {
    const reservation = await prisma.reservation.findUnique({ where: { id } })

    if (!reservation) {
      throw new NotFoundError('Reservation not found')
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenError('You do not have access to this reservation')
    }

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestError('Reservation is already cancelled')
    }

    if (reservation.status === 'CHECKED_IN') {
      throw new BadRequestError('Cannot cancel a checked-in reservation')
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return updatedReservation
  }

  async checkIn(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { event: true, user: true },
    })

    if (!reservation) {
      throw new NotFoundError('Reservation not found')
    }

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestError('Cannot check in a cancelled reservation')
    }

    if (reservation.status === 'CHECKED_IN') {
      throw new BadRequestError('Already checked in')
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
      },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return updatedReservation
  }
}
