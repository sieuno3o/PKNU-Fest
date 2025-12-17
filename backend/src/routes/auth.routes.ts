import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validation.middleware'
import { authenticate } from '../middleware/auth.middleware'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  sendStudentVerificationSchema,
  verifyCodeOnlySchema,
  confirmStudentVerificationSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  deleteAccountSchema,
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

router.post('/change-password', authenticate, validate(changePasswordSchema), (req, res, next) =>
  authController.changePassword(req, res, next)
)

// Student verification routes
router.post(
  '/verify-student',
  authenticate,
  validate(sendStudentVerificationSchema),
  (req, res, next) => authController.sendStudentVerification(req, res, next)
)

// 코드만 검증 (다음 단계 전)
router.post(
  '/verify-code',
  authenticate,
  validate(verifyCodeOnlySchema),
  (req, res, next) => authController.verifyCodeOnly(req, res, next)
)

router.post(
  '/confirm-student',
  authenticate,
  validate(confirmStudentVerificationSchema),
  (req, res, next) => authController.confirmStudentVerification(req, res, next)
)

// Password reset routes (Public)
router.post(
  '/password-reset/request',
  validate(requestPasswordResetSchema),
  (req, res, next) => authController.requestPasswordReset(req, res, next)
)

router.post(
  '/password-reset/confirm',
  validate(resetPasswordSchema),
  (req, res, next) => authController.resetPassword(req, res, next)
)

// Delete account route (Protected)
router.delete(
  '/me',
  authenticate,
  validate(deleteAccountSchema),
  (req, res, next) => authController.deleteAccount(req, res, next)
)

export default router
