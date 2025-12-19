import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { ReservationsController } from '../controllers/reservations.controller'
import { authenticate } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()
const adminController = new AdminController()
const reservationsController = new ReservationsController()

// All routes require admin authentication
router.use(authenticate, requireAdmin)

// 통계 API
router.get('/statistics', (req, res, next) => adminController.getStatistics(req, res, next))
router.get('/statistics/daily-trend', (req, res, next) => adminController.getDailyTrend(req, res, next))
router.get('/statistics/categories', (req, res, next) => adminController.getCategoryStats(req, res, next))
router.get('/statistics/popular-events', (req, res, next) => adminController.getPopularEvents(req, res, next))
router.get('/statistics/recent-activity', (req, res, next) => adminController.getRecentActivity(req, res, next))

// 기존 관리 API
router.get('/reservations', (req, res, next) => adminController.getAllReservations(req, res, next))
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next))
router.get('/vendors', (req, res, next) => adminController.getVendors(req, res, next))
router.get('/checkin/history', (req, res, next) => adminController.getCheckinHistory(req, res, next))

// 예약 관리 API (선정 방식)
router.get('/events/:eventId/reservations', (req, res, next) => reservationsController.getEventReservations(req, res, next))
router.post('/reservations/:id/approve', (req, res, next) => reservationsController.approveReservation(req, res, next))
router.post('/reservations/:id/reject', (req, res, next) => reservationsController.rejectReservation(req, res, next))

// 알림 발송 API
router.post('/notifications', (req, res, next) => adminController.sendNotification(req, res, next))

export default router

