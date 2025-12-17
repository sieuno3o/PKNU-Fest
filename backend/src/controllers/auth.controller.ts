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

  async changePassword(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { currentPassword, newPassword } = req.body
      const result = await authService.changePassword(req.user.userId, currentPassword, newPassword)
      return ResponseUtil.success(res, result, 'Password changed successfully')
    } catch (error) {
      next(error)
    }
  }

  async sendStudentVerification(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { pknu_student_email } = req.body
      const result = await authService.sendStudentVerification(req.user.userId, pknu_student_email)
      return ResponseUtil.success(res, result, 'Verification code sent')
    } catch (error) {
      next(error)
    }
  }

  // 코드만 검증 (다음 단계 전 확인)
  async verifyCodeOnly(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { code } = req.body
      const result = await authService.verifyCodeOnly(req.user.userId, code)
      return ResponseUtil.success(res, result, 'Code verified')
    } catch (error) {
      next(error)
    }
  }

  async confirmStudentVerification(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { code, studentId, department, grade } = req.body
      const result = await authService.confirmStudentVerification(
        req.user.userId,
        code,
        studentId,
        department,
        grade
      )
      return ResponseUtil.success(res, result, 'Student verification confirmed')
    } catch (error) {
      next(error)
    }
  }

  // Password Reset Methods
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const result = await authService.requestPasswordReset(email)
      return ResponseUtil.success(res, result, 'Password reset requested')
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body
      const result = await authService.resetPassword(token, newPassword)
      return ResponseUtil.success(res, result, 'Password reset successful')
    } catch (error) {
      next(error)
    }
  }

  // Delete Account
  async deleteAccount(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const { password } = req.body
      const result = await authService.deleteAccount(req.user.userId, password)
      return ResponseUtil.success(res, result, 'Account deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}
