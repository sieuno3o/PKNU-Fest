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

  async getCheckinHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
      const history = await adminService.getCheckinHistory(limit)
      return ResponseUtil.success(res, history)
    } catch (error) {
      next(error)
    }
  }
}
