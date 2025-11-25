import { Router } from 'express'
import { VendorController } from '../controllers/vendor.controller'
import { OrdersController } from '../controllers/orders.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireVendor } from '../middleware/role.middleware'

const router = Router()
const vendorController = new VendorController()
const ordersController = new OrdersController()

// All routes require vendor authentication
router.use(authenticate, requireVendor)

router.get('/sales/today', (req, res, next) => vendorController.getTodaySales(req, res, next))

router.get('/sales', (req, res, next) => vendorController.getSalesStatistics(req, res, next))

router.get('/orders', (req, res, next) => ordersController.getVendorOrders(req, res, next))

export default router
