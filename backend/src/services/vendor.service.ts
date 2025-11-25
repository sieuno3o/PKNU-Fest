import prisma from '../utils/prisma'
import { NotFoundError } from '../utils/error.util'

export class VendorService {
  async getTodaySales(userId: string) {
    const foodTruck = await prisma.foodTruck.findFirst({
      where: { ownerId: userId },
    })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const orders = await prisma.order.findMany({
      where: {
        foodTruckId: foodTruck.id,
        createdAt: { gte: today },
        status: { not: 'CANCELLED' },
      },
    })

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalOrders = orders.length

    return {
      totalSales,
      totalOrders,
      orders,
    }
  }

  async getSalesStatistics(userId: string, startDate?: Date, endDate?: Date) {
    const foodTruck = await prisma.foodTruck.findFirst({
      where: { ownerId: userId },
    })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    const where: any = {
      foodTruckId: foodTruck.id,
      status: { not: 'CANCELLED' },
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [orders, menuStats] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      }),
      prisma.orderItem.groupBy({
        by: ['menuItemId'],
        _sum: {
          quantity: true,
          price: true,
        },
        where: {
          order: where,
        },
      }),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return {
      totalRevenue,
      totalOrders: orders.length,
      menuStats,
    }
  }
}
