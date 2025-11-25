// src/types/http.ts
import { Request } from 'express'

export type AuthedRequest = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}
