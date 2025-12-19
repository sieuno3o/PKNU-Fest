import { Router } from 'express'
import authRoutes from './auth.routes'
import eventsRoutes from './events.routes'
import reservationsRoutes from './reservations.routes'
import foodTrucksRoutes from './foodtrucks.routes'
import ordersRoutes from './orders.routes'
import adminRoutes from './admin.routes'
import vendorRoutes from './vendor.routes'
import boothZoneRoutes from './boothZone.routes'

const router = Router()

// API Routes
router.use('/auth', authRoutes)
router.use('/events', eventsRoutes)
router.use('/reservations', reservationsRoutes)
router.use('/foodtrucks', foodTrucksRoutes)
router.use('/orders', ordersRoutes)
router.use('/admin', adminRoutes)
router.use('/vendor', vendorRoutes)
router.use('/booth-zones', boothZoneRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router

