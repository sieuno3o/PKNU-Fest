import prisma from '../utils/prisma'

export class AdminService {
  async getStatistics() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalUsers, totalEvents, totalReservations, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.reservation.count(),
      prisma.order.count(),
    ])

    // 활성 행사 (PUBLISHED 상태)
    const activeEvents = await prisma.event.count({
      where: { status: 'PUBLISHED' },
    })

    // 오늘 예약
    const todayReservations = await prisma.reservation.count({
      where: {
        createdAt: { gte: today },
      },
    })

    // 확정된 예약 (체크인 전)
    const pendingReservations = await prisma.reservation.count({
      where: { status: 'CONFIRMED' },
    })

    // 체크인된 예약
    const checkedInReservations = await prisma.reservation.count({
      where: { status: 'CHECKED_IN' },
    })

    // 체크인율 계산
    const confirmedReservations = await prisma.reservation.count({
      where: { status: 'CONFIRMED' },
    })
    const checkInRate = confirmedReservations + checkedInReservations > 0
      ? Math.round((checkedInReservations / (confirmedReservations + checkedInReservations)) * 100)
      : 0

    const activeOrders = await prisma.order.count({
      where: { status: { in: ['PENDING', 'PREPARING'] } },
    })

    return {
      totalUsers,
      totalEvents,
      activeEvents,
      totalReservations,
      todayReservations,
      pendingReservations,
      checkInRate,
      totalOrders,
      confirmedReservations,
      activeOrders,
    }
  }

  // 일간 예약 추이 (최근 7일)
  async getDailyReservationTrend() {
    const days = 7
    const result = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = await prisma.reservation.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      })

      result.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        reservations: count,
      })
    }

    return result
  }

  // 카테고리별 행사 통계
  async getCategoryStats() {
    const events = await prisma.event.groupBy({
      by: ['category'],
      _count: { id: true },
    })

    return events.map(e => ({
      category: e.category || '기타',
      count: e._count.id,
    }))
  }

  // 인기 행사 순위 (예약 수 기준)
  async getPopularEvents(limit: number = 5) {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: {
        reservations: { _count: 'desc' },
      },
      take: limit,
    })

    return events.map(e => ({
      id: e.id,
      title: e.title,
      category: e.category,
      reservationCount: e._count.reservations,
      capacity: e.capacity,
    }))
  }

  // 최근 활동 로그
  async getRecentActivity(limit: number = 10) {
    const [recentReservations, recentCheckins] = await Promise.all([
      prisma.reservation.findMany({
        where: { status: 'CONFIRMED' },
        include: {
          user: { select: { name: true } },
          event: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: Math.floor(limit / 2),
      }),
      prisma.reservation.findMany({
        where: { status: 'CHECKED_IN' },
        include: {
          user: { select: { name: true } },
          event: { select: { title: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: Math.floor(limit / 2),
      }),
    ])

    const activities = [
      ...recentReservations.map(r => ({
        id: r.id,
        type: 'reservation' as const,
        message: `${r.user.name}님이 ${r.event.title}을(를) 예약했습니다`,
        time: r.createdAt,
      })),
      ...recentCheckins.map(r => ({
        id: `checkin-${r.id}`,
        type: 'checkin' as const,
        message: `${r.user.name}님이 ${r.event.title}에 체크인했습니다`,
        time: r.updatedAt,
      })),
    ]

    // 시간순 정렬
    return activities.sort((a, b) =>
      new Date(b.time).getTime() - new Date(a.time).getTime()
    ).slice(0, limit)
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
            phone: true,
            isStudentVerified: true,
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

  async getVendors() {
    const vendors = await prisma.user.findMany({
      where: { role: 'VENDOR' },
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    })

    return vendors
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

  async sendNotification(target: 'USER' | 'VENDOR' | 'ALL', title: string, message: string) {
    // 대상 사용자 조회
    let users: { id: string; name: string | null; email: string }[] = []

    if (target === 'USER') {
      users = await prisma.user.findMany({
        where: { role: 'USER' },
        select: { id: true, name: true, email: true },
      })
    } else if (target === 'VENDOR') {
      users = await prisma.user.findMany({
        where: { role: 'VENDOR' },
        select: { id: true, name: true, email: true },
      })
    } else {
      users = await prisma.user.findMany({
        where: { role: { in: ['USER', 'VENDOR'] } },
        select: { id: true, name: true, email: true },
      })
    }

    // Socket.IO를 통해 알림 발송
    const io = (global as any).io
    if (io) {
      // 모든 연결된 클라이언트에게 알림 발송
      const notificationData = {
        type: 'admin',
        title,
        message,
        target, // 클라이언트에서 필터링할 수 있도록 대상 정보 포함
        timestamp: new Date().toISOString(),
      }

      // 모든 클라이언트에게 발송 (클라이언트에서 필터링)
      io.emit('notification', notificationData)
      console.log(`📣 Notification sent to all clients: ${title}`)
    }

    return {
      targetCount: users.length,
      target,
      title,
      message,
    }
  }
}

