import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()
const adminController = new AdminController()

// All routes require admin authentication
router.use(authenticate, requireAdmin)

router.get('/statistics', (req, res, next) => adminController.getStatistics(req, res, next))

router.get('/reservations', (req, res, next) => adminController.getAllReservations(req, res, next))

router.get('/users', (req, res, next) => adminController.getUsers(req, res, next))

router.get('/checkin/history', (req, res, next) => adminController.getCheckinHistory(req, res, next))

export default router
