import { Router } from 'express'
import { EventsController } from '../controllers/events.controller'
import { validate, validateQuery } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  createTimeSlotSchema,
} from '../utils/validation.schemas'

const router = Router()
const eventsController = new EventsController()

// Public routes
router.get('/', validateQuery(eventQuerySchema), (req, res, next) =>
  eventsController.getEvents(req, res, next)
)

router.get('/locations', (req, res, next) => eventsController.getEventLocations(req, res, next))

router.get('/:id', (req, res, next) => eventsController.getEvent(req, res, next))

router.get('/:id/timeslots', (req, res, next) => eventsController.getTimeSlots(req, res, next))

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createEventSchema), (req, res, next) =>
  eventsController.createEvent(req, res, next)
)

router.put('/:id', authenticate, requireAdmin, validate(updateEventSchema), (req, res, next) =>
  eventsController.updateEvent(req, res, next)
)

router.delete('/:id', authenticate, requireAdmin, (req, res, next) =>
  eventsController.deleteEvent(req, res, next)
)

router.post('/:id/timeslots', authenticate, requireAdmin, validate(createTimeSlotSchema), (req, res, next) =>
  eventsController.createTimeSlot(req, res, next)
)

export default router
