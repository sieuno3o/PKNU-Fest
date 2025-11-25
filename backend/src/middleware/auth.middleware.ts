// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { JwtUtil } from '../utils/jwt.util'
import { UnauthorizedError } from '../utils/error.util'

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.substring(7)
    const payload = JwtUtil.verify(token) // JwtPayload { userId, email, role }

    // ✅ 타입스크립트에게만 "일단 any로 보고 user 프로퍼티 허용해 줘"라고 알려주는 부분
    ;(req as any).user = {
      userId: String(payload.userId),
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = JwtUtil.verify(token)

      ;(req as any).user = {
        userId: String(payload.userId),
        email: payload.email,
        role: payload.role,
      }
    }

    next()
  } catch (_error) {
    // 토큰이 잘못됐으면 그냥 비로그인 상태로 진행
    next()
  }
}
