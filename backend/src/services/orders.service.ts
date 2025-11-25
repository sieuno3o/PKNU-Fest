import prisma from '../utils/prisma'
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/error.util'
import { CreateOrderInput } from '../utils/validation.schemas'

export class OrdersService {
  async createOrder(userId: string, data: CreateOrderInput) {
    // Verify food truck exists
    const foodTruck = await prisma.foodTruck.findUnique({
      where: { id: data.foodTruckId },
    })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    // Verify all menu items exist and calculate total
    let totalPrice = 0
    const orderItems: any[] = []

    for (const item of data.items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      })

      if (!menuItem) {
        throw new NotFoundError(`Menu item ${item.menuItemId} not found`)
      }

      if (!menuItem.available) {
        throw new BadRequestError(`Menu item ${menuItem.name} is not available`)
      }

      totalPrice += menuItem.price * item.quantity
      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      })
    }

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        userId,
        foodTruckId: data.foodTruckId,
        totalPrice,
        status: 'PENDING',
        pickupNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        foodTruck: true,
      },
    })

    return order
  }

  async getOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        foodTruck: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return orders
  }

  async getOrder(id: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        foodTruck: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== userId) {
      throw new ForbiddenError('You do not have access to this order')
    }

    return order
  }

  async updateOrderStatus(orderId: string, status: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { foodTruck: true },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    // Verify user is the food truck owner
    if (order.foodTruck.ownerId !== userId) {
      throw new ForbiddenError('You do not have permission to update this order')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return updatedOrder
  }

  async cancelOrder(id: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== userId) {
      throw new ForbiddenError('You do not have access to this order')
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestError('Can only cancel pending orders')
    }

    const cancelled = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return cancelled
  }

  // Vendor-specific methods
  async getVendorOrders(userId: string, filters?: { status?: string }) {
    const foodTruck = await prisma.foodTruck.findFirst({
      where: { ownerId: userId },
    })

    if (!foodTruck) {
      throw new NotFoundError('Food truck not found')
    }

    const where: any = { foodTruckId: foodTruck.id }

    if (filters?.status) {
      where.status = filters.status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return orders
  }
}
