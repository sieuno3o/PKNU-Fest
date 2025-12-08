import prisma from '../utils/prisma'
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/error.util'
import { CreateOrderInput, ProcessPaymentInput } from '../utils/validation.schemas'
import { io } from '../index'
import { emitOrderUpdate } from '../socket'
import { v4 as uuidv4 } from 'uuid'

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

    // Emit Socket.IO event
    emitOrderUpdate(io, order)

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

    // Emit Socket.IO event
    emitOrderUpdate(io, updatedOrder)

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

  // Payment methods
  async processPayment(orderId: string, userId: string, data: ProcessPaymentInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        foodTruck: true,
        orderItems: {
          include: {
            menuItem: true,
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

    if (order.paymentStatus !== 'PENDING') {
      throw new BadRequestError('Payment already processed')
    }

    // 모의 결제 처리 - 실제 API 호출 없음
    const paymentId = uuidv4()

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
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

    // Emit Socket.IO event
    emitOrderUpdate(io, updatedOrder)

    return updatedOrder
  }

  async cancelPayment(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== userId) {
      throw new ForbiddenError('You do not have access to this order')
    }

    if (order.paymentStatus !== 'PAID') {
      throw new BadRequestError('Can only cancel paid orders')
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestError('Cannot cancel payment for orders in progress')
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'CANCELLED',
        status: 'CANCELLED',
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

    // Emit Socket.IO event
    emitOrderUpdate(io, cancelledOrder)

    return cancelledOrder
  }
}
