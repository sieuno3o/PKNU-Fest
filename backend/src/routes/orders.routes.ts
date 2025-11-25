import { Router } from 'express'
import { OrdersController } from '../controllers/orders.controller'
import { validate } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import { requireVendor } from '../middleware/role.middleware'
import { createOrderSchema, updateOrderStatusSchema } from '../utils/validation.schemas'

const router = Router()
const ordersController = new OrdersController()

// All routes require authentication
router.use(authenticate)

// Customer routes
router.post('/', validate(createOrderSchema), (req, res, next) =>
  ordersController.createOrder(req, res, next)
)

router.get('/', (req, res, next) => ordersController.getOrders(req, res, next))

router.get('/:id', (req, res, next) => ordersController.getOrder(req, res, next))

router.post('/:id/cancel', (req, res, next) => ordersController.cancelOrder(req, res, next))

// Vendor routes
router.patch('/:id/status', requireVendor, validate(updateOrderStatusSchema), (req, res, next) =>
  ordersController.updateOrderStatus(req, res, next)
)

export default router
