// src/types/auth.ts
import { Request } from 'express'

// 🔹 커스텀 JwtPayload 타입
export interface JwtPayload {
  userId: string
  email: string
  role: string
}

// 🔹 Express Request에 JwtPayload를 얹은 타입
export interface AuthRequest extends Request {
  user?: JwtPayload
}
