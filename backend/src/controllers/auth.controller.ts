import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { ResponseUtil } from '../utils/response.util'

const authService = new AuthService()

// 🔹 user가 붙은 Request 타입 (이 파일 안에서만 사용할 용도)
type ReqWithUser = Request & {
  user?: {
    userId: string
    // 나중에 필요하면 email, role 같은 것도 여기 추가 가능
    // email?: string
    // role?: string
  }
}

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body)
      return ResponseUtil.created(res, result, 'Registration successful')
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body)
      return ResponseUtil.success(res, result, 'Login successful')
    } catch (error) {
      next(error)
    }
  }

  // 🔹 req 타입만 ReqWithUser로 바꿔줌
  async getMe(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const user = await authService.getMe(req.user.userId) // userId: string
      return ResponseUtil.success(res, user)
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const user = await authService.updateProfile(req.user.userId, req.body)
      return ResponseUtil.success(res, user, 'Profile updated successfully')
    } catch (error) {
      next(error)
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      return ResponseUtil.success(res, null, 'Logout successful')
    } catch (error) {
      next(error)
    }
  }
}
