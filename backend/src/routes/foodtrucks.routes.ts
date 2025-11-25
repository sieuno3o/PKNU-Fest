import { Router } from 'express'
import { FoodTrucksController } from '../controllers/foodtrucks.controller'
import { validate } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin, requireVendor } from '../middleware/role.middleware'
import {
  createFoodTruckSchema,
  updateFoodTruckSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from '../utils/validation.schemas'

const router = Router()
const foodTrucksController = new FoodTrucksController()

// Public routes
router.get('/', (req, res, next) => foodTrucksController.getFoodTrucks(req, res, next))
router.get('/locations', (req, res, next) => foodTrucksController.getFoodTruckLocations(req, res, next))
router.get('/:id', (req, res, next) => foodTrucksController.getFoodTruck(req, res, next))
router.get('/:id/menu', (req, res, next) => foodTrucksController.getMenu(req, res, next))

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createFoodTruckSchema), (req, res, next) =>
  foodTrucksController.createFoodTruck(req, res, next)
)

router.delete('/:id', authenticate, requireAdmin, (req, res, next) =>
  foodTrucksController.deleteFoodTruck(req, res, next)
)

// Vendor routes
router.put('/:id', authenticate, requireVendor, validate(updateFoodTruckSchema), (req, res, next) =>
  foodTrucksController.updateFoodTruck(req, res, next)
)

router.post('/:id/menu', authenticate, requireVendor, validate(createMenuItemSchema), (req, res, next) =>
  foodTrucksController.createMenuItem(req, res, next)
)

router.put('/menu/:id', authenticate, requireVendor, validate(updateMenuItemSchema), (req, res, next) =>
  foodTrucksController.updateMenuItem(req, res, next)
)

router.delete('/menu/:id', authenticate, requireVendor, (req, res, next) =>
  foodTrucksController.deleteMenuItem(req, res, next)
)

export default router
