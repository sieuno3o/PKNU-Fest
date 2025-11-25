import prisma from '../utils/prisma'

export class AdminService {
  async getStatistics() {
    const [totalUsers, totalEvents, totalReservations, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.reservation.count(),
      prisma.order.count(),
    ])

    const pendingReservations = await prisma.reservation.count({
      where: { status: 'PENDING' },
    })

    const activeOrders = await prisma.order.count({
      where: { status: { in: ['PENDING', 'PREPARING'] } },
    })

    return {
      totalUsers,
      totalEvents,
      totalReservations,
      totalOrders,
      pendingReservations,
      activeOrders,
    }
  }

  async getAllReservations(filters?: { eventId?: string; status?: string }) {
    const where: any = {}

    if (filters?.eventId) where.eventId = filters.eventId
    if (filters?.status) where.status = filters.status

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: true,
        timeSlot: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reservations
  }

  async getUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return users
  }

  async getCheckinHistory(limit: number = 50) {
    const checkins = await prisma.reservation.findMany({
      where: { status: 'CHECKED_IN' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    })

    return checkins
  }
}
