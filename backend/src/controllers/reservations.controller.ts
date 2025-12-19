import { Request, Response, NextFunction } from 'express'
import { ReservationsService } from '../services/reservations.service'
import { ResponseUtil } from '../utils/response.util'

const reservationsService = new ReservationsService()

// 이 컨트롤러 안에서만 사용할, user가 붙은 Request 타입
type ReqWithUser = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}

export class ReservationsController {
  async createReservation(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const reservation = await reservationsService.createReservation(req.user.userId, req.body)

      return ResponseUtil.created(res, reservation, 'Reservation created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getReservations(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const reservations = await reservationsService.getReservations(req.user.userId, req.query)

      return ResponseUtil.success(res, reservations)
    } catch (error) {
      next(error)
    }
  }

  async getReservation(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'ORGANIZER'
      const reservation = await reservationsService.getReservation(req.user.userId, req.params.id, isAdmin)

      return ResponseUtil.success(res, reservation)
    } catch (error) {
      next(error)
    }
  }

  async cancelReservation(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const reservation = await reservationsService.cancelReservation(
        req.user.userId,
        req.params.id
      )

      return ResponseUtil.success(res, reservation, 'Reservation cancelled successfully')
    } catch (error) {
      next(error)
    }
  }

  async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      // 체크인은 사용자 정보 안 쓰니까 그냥 기본 Request 유지
      const reservation = await reservationsService.checkIn(req.params.id)
      return ResponseUtil.success(res, reservation, 'Check-in successful')
    } catch (error) {
      next(error)
    }
  }

  // 관리자: 이벤트별 예약 목록 조회
  async getEventReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationsService.getEventReservations(
        req.params.eventId,
        req.query as { status?: string }
      )
      return ResponseUtil.success(res, reservations)
    } catch (error) {
      next(error)
    }
  }

  // 관리자: 예약 신청 수락 (선정 방식)
  async approveReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationsService.approveReservation(req.params.id)
      return ResponseUtil.success(res, reservation, 'Reservation approved successfully')
    } catch (error) {
      next(error)
    }
  }

  // 관리자: 예약 신청 거절 (선정 방식)
  async rejectReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationsService.rejectReservation(req.params.id)
      return ResponseUtil.success(res, reservation, 'Reservation rejected')
    } catch (error) {
      next(error)
    }
  }
}
