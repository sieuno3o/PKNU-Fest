// src/utils/jwt.util.ts
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from './error.util'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export class JwtUtil {
  private static readonly secret = JWT_SECRET
  private static readonly expiresIn = JWT_EXPIRES_IN

  static sign(payload: JwtPayload): string {
    // 타입 꼬임 방지용 any 캐스팅 – 내부에서만 사용
    return (jwt as any).sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    })
  }

  static verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret)

      if (typeof decoded === 'string') {
        throw new UnauthorizedError('Invalid token payload')
      }

      return decoded as JwtPayload
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token')
    }
  }

  static decode(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token)

      if (!decoded || typeof decoded === 'string') {
        return null
      }

      return decoded as JwtPayload
    } catch {
      return null
    }
  }
}
