import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  sendStudentVerificationSchema,
  confirmStudentVerificationSchema,
} from '../utils/validation.schemas'

const router = Router()
const authController = new AuthController()

// Public routes
router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
)

router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next))

// Protected routes
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next))

router.put('/me', authenticate, validate(updateProfileSchema), (req, res, next) =>
  authController.updateProfile(req, res, next)
)

router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next))

// Student verification routes
router.post(
  '/verify-student',
  authenticate,
  validate(sendStudentVerificationSchema),
  (req, res, next) => authController.sendStudentVerification(req, res, next)
)

router.post(
  '/confirm-student',
  authenticate,
  validate(confirmStudentVerificationSchema),
  (req, res, next) => authController.confirmStudentVerification(req, res, next)
)

export default router
