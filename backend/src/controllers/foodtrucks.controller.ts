import { Request, Response, NextFunction } from 'express'
import { FoodTrucksService } from '../services/foodtrucks.service'
import { ResponseUtil } from '../utils/response.util'

const foodTrucksService = new FoodTrucksService()

// 이 컨트롤러 안에서만 사용할, user가 붙은 Request 타입
type ReqWithUser = Request & {
  user?: {
    userId: string
    email?: string
    role: string
  }
}

export class FoodTrucksController {
  async createFoodTruck(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const ownerId = (req.user.role === 'ADMIN' && req.body.ownerId)
        ? req.body.ownerId
        : req.user.userId

      const foodTruck = await foodTrucksService.createFoodTruck(ownerId, req.body)
      return ResponseUtil.created(res, foodTruck, 'Food truck created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getFoodTrucks(_req: Request, res: Response, next: NextFunction) {
    try {
      const foodTrucks = await foodTrucksService.getFoodTrucks()
      return ResponseUtil.success(res, foodTrucks)
    } catch (error) {
      next(error)
    }
  }

  async getFoodTruck(req: Request, res: Response, next: NextFunction) {
    try {
      const foodTruck = await foodTrucksService.getFoodTruck(req.params.id)
      return ResponseUtil.success(res, foodTruck)
    } catch (error) {
      next(error)
    }
  }

  async updateFoodTruck(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const foodTruck = await foodTrucksService.updateFoodTruck(
        req.params.id,
        req.user.userId,
        req.body
      )
      return ResponseUtil.success(res, foodTruck, 'Food truck updated successfully')
    } catch (error) {
      next(error)
    }
  }

  async deleteFoodTruck(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await foodTrucksService.deleteFoodTruck(req.params.id)
      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }

  async getFoodTruckLocations(_req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await foodTrucksService.getFoodTruckLocations()
      return ResponseUtil.success(res, locations)
    } catch (error) {
      next(error)
    }
  }

  async createMenuItem(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const menuItem = await foodTrucksService.createMenuItem(
        req.params.id,
        req.user.userId,
        req.body
      )
      return ResponseUtil.created(res, menuItem, 'Menu item created successfully')
    } catch (error) {
      next(error)
    }
  }

  async getMenu(_req: Request, res: Response, next: NextFunction) {
    try {
      const menu = await foodTrucksService.getMenu(_req.params.id)
      return ResponseUtil.success(res, menu)
    } catch (error) {
      next(error)
    }
  }

  async updateMenuItem(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const menuItem = await foodTrucksService.updateMenuItem(
        req.params.id,
        req.user.userId,
        req.body
      )
      return ResponseUtil.success(res, menuItem, 'Menu item updated successfully')
    } catch (error) {
      next(error)
    }
  }

  async deleteMenuItem(req: ReqWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const result = await foodTrucksService.deleteMenuItem(req.params.id, req.user.userId)
      return ResponseUtil.success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
