import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export class ResponseUtil {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    }
    return res.status(statusCode).json(response)
  }

  static created<T>(res: Response, data?: T, message?: string): Response {
    return this.success(res, data, message, 201)
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    }
    return res.status(statusCode).json(response)
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      message,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
    return res.status(200).json(response)
  }
}
