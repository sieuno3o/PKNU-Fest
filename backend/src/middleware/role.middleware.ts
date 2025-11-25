import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '../utils/error.util'

// 이 미들웨어 안에서만 사용할 Request 타입 (user 포함)
type ReqWithUser = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}

export const requireRole = (...roles: string[]) => {
  return (req: ReqWithUser, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'))
    }

    return next()
  }
}

export const requireAdmin = requireRole('ADMIN')
export const requireVendor = requireRole('VENDOR', 'ADMIN')
