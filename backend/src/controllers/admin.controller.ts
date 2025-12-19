import { Request, Response, NextFunction } from 'express'
import { AdminService } from '../services/admin.service'
import { ResponseUtil } from '../utils/response.util'

const adminService = new AdminService()

export class AdminController {
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getStatistics()
      return ResponseUtil.success(res, stats)
    } catch (error) {
      next(error)
    }
  }

  async getDailyTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const trend = await adminService.getDailyReservationTrend()
      return ResponseUtil.success(res, trend)
    } catch (error) {
      next(error)
    }
  }

  async getCategoryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getCategoryStats()
      return ResponseUtil.success(res, stats)
    } catch (error) {
      next(error)
    }
  }

  async getPopularEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5
      const events = await adminService.getPopularEvents(limit)
      return ResponseUtil.success(res, events)
    } catch (error) {
      next(error)
    }
  }

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
      const activities = await adminService.getRecentActivity(limit)
      return ResponseUtil.success(res, activities)
    } catch (error) {
      next(error)
    }
  }

  async getAllReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await adminService.getAllReservations(req.query)
      return ResponseUtil.success(res, reservations)
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getUsers()
      return ResponseUtil.success(res, users)
    } catch (error) {
      next(error)
    }
  }

  async getVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await adminService.getVendors()
      return ResponseUtil.success(res, vendors)
    } catch (error) {
      next(error)
    }
  }

  async getCheckinHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
      const history = await adminService.getCheckinHistory(limit)
      return ResponseUtil.success(res, history)
    } catch (error) {
      next(error)
    }
  }

  async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { target, title, message } = req.body

      if (!target || !title || !message) {
        return res.status(400).json({ message: '대상, 제목, 내용을 모두 입력해주세요' })
      }

      const result = await adminService.sendNotification(target, title, message)
      return ResponseUtil.success(res, result, '알림이 발송되었습니다')
    } catch (error) {
      next(error)
    }
  }
}

