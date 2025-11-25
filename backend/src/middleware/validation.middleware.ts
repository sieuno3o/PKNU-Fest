// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { z, ZodError, ZodTypeAny, ZodIssue } from 'zod'
import { ValidationError } from '../utils/error.util'

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      return next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = (error.issues as ZodIssue[]).map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }))
        return next(new ValidationError('Validation failed', errors))
      }

      return next(error as Error)
    }
  }
}

export const validateQuery = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query)
      ;(req as any).query = validated
      return next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = (error.issues as ZodIssue[]).map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }))
        return next(new ValidationError('Validation failed', errors))
      }

      return next(error as Error)
    }
  }
}

// 필요하면 밖에서 z를 같이 쓰려고 export
export { z }
