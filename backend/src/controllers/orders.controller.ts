import { Request, Response, NextFunction } from 'express'
import { OrdersService } from '../services/orders.service'
import { ResponseUtil } from '../utils/response.util'

const ordersService = new OrdersService()

// 이 컨트롤러 안에서만 사용할, user가 붙은 Request 타입
type ReqWithUser = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}

export class OrdersController {
  async createOrder(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const order = await ordersService.createOrder(req.user.userId, req.body)
      return ResponseUtil.created(res, order, 'Order created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const orders = await ordersService.getOrders(req.user.userId)
      return ResponseUtil.success(res, orders)
    } catch (error) {
      next(error)
    }
  }

  async getOrder(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const order = await ordersService.getOrder(req.params.id, req.user.userId)
      return ResponseUtil.success(res, order)
    } catch (error) {
      next(error)
    }
  }

  async updateOrderStatus(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const order = await ordersService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.user.userId
      )
      return ResponseUtil.success(res, order, 'Order status updated successfully')
    } catch (error) {
      next(error)
    }
  }

  async cancelOrder(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const order = await ordersService.cancelOrder(req.params.id, req.user.userId)
      return ResponseUtil.success(res, order, 'Order cancelled successfully')
    } catch (error) {
      next(error)
    }
  }

  async getVendorOrders(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const orders = await ordersService.getVendorOrders(req.user.userId, req.query)
      return ResponseUtil.success(res, orders)
    } catch (error) {
      next(error)
    }
  }
}
