import { Router } from 'express'
import { ReservationsController } from '../controllers/reservations.controller'
import { validate } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'
import { createReservationSchema } from '../utils/validation.schemas'

const router = Router()
const reservationsController = new ReservationsController()

// All routes require authentication
router.use(authenticate)

router.get('/', (req, res, next) => reservationsController.getReservations(req, res, next))

router.post('/', validate(createReservationSchema), (req, res, next) =>
  reservationsController.createReservation(req, res, next)
)

router.get('/:id', (req, res, next) => reservationsController.getReservation(req, res, next))

router.delete('/:id', (req, res, next) => reservationsController.cancelReservation(req, res, next))

// Admin/Staff check-in route
router.post('/:id/checkin', requireAdmin, (req, res, next) =>
  reservationsController.checkIn(req, res, next)
)

export default router
