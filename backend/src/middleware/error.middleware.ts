import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/error.util'
import { ResponseUtil } from '../utils/response.util'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return ResponseUtil.error(res, err.message, err.statusCode)
  }

  // Unknown errors
  console.error('Unexpected Error:', err)
  return ResponseUtil.error(res, 'Internal Server Error', 500)
}

export const notFoundHandler = (req: Request, res: Response) => {
  return ResponseUtil.error(res, `Route ${req.originalUrl} not found`, 404)
}
