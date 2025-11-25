import { Request, Response, NextFunction } from 'express'
import { VendorService } from '../services/vendor.service'
import { ResponseUtil } from '../utils/response.util'

const vendorService = new VendorService()

// 이 컨트롤러 안에서만 사용할, user가 붙은 Request 타입
type ReqWithUser = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}

export class VendorController {
  async getTodaySales(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const sales = await vendorService.getTodaySales(req.user.userId)
      return ResponseUtil.success(res, sales)
    } catch (error) {
      next(error)
    }
  }

  async getSalesStatistics(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

      const stats = await vendorService.getSalesStatistics(req.user.userId, startDate, endDate)
      return ResponseUtil.success(res, stats)
    } catch (error) {
      next(error)
    }
  }
}
