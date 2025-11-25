// src/types/auth.ts
import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

// 🔹 JwtPayload를 기반으로 userId만 추가한 타입
export type AuthUser = JwtPayload & {
  userId: string
}

// 🔹 Express Request에 AuthUser를 얹은 타입
export interface AuthRequest extends Request {
  user?: AuthUser
}
