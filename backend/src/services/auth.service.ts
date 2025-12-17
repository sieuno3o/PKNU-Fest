import prisma from '../utils/prisma'
import { BcryptUtil } from '../utils/bcrypt.util'
import { JwtUtil, JwtPayload } from '../utils/jwt.util'
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/error.util'
import { RegisterInput, LoginInput } from '../utils/validation.schemas'
import { sendStudentVerificationEmail, sendPasswordResetEmail } from '../utils/email.util'

export class AuthService {
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    // Hash password
    const hashedPassword = await BcryptUtil.hash(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: 'USER', // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isStudentVerified: true,
        createdAt: true,
      },
    })

    // Generate JWT token
    const token = JwtUtil.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user, token }
  }

  async login(data: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Verify password
    const isValid = await BcryptUtil.compare(data.password, user.password)

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate JWT token
    const token = JwtUtil.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isStudentVerified: user.isStudentVerified,
        createdAt: user.createdAt,
      },
      token,
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isStudentVerified: true,
        studentEmail: true,
        studentId: true,
        department: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('Email already in use')
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isStudentVerified: true,
        studentEmail: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return updatedUser
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // 현재 비밀번호 확인
    const isValid = await BcryptUtil.compare(currentPassword, user.password)
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect')
    }

    // 새 비밀번호 해시
    const hashedPassword = await BcryptUtil.hash(newPassword)

    // 비밀번호 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { message: 'Password changed successfully' }
  }

  // Student Verification Methods
  private verificationCodes: Map<string, { code: string; studentEmail: string; expiresAt: Date }> = new Map()

  async sendStudentVerification(userId: string, studentEmail: string) {
    // Get user info for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Check if student email is already verified by another user
    const existingUser = await prisma.user.findUnique({
      where: { studentEmail },
    })

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError('This student email is already verified by another user')
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code
    this.verificationCodes.set(userId, { code, studentEmail, expiresAt })

    // Send email with verification code
    try {
      await sendStudentVerificationEmail(studentEmail, user.name, code)
      console.log(`✅ Verification code sent to ${studentEmail}: ${code}`)
    } catch (error) {
      console.error('❌ Failed to send verification email:', error)
      // Still log the code for development
      console.log(`📧 Verification code for ${studentEmail}: ${code}`)
    }

    return {
      message: 'Verification code sent to your student email',
      expiresAt,
    }
  }

  // 코드만 검증 (학생 정보 입력 전 단계)
  async verifyCodeOnly(userId: string, code: string) {
    const verification = this.verificationCodes.get(userId)

    if (!verification) {
      throw new BadRequestError('No verification code found. Please request a new code.')
    }

    if (verification.expiresAt < new Date()) {
      this.verificationCodes.delete(userId)
      throw new BadRequestError('Verification code has expired. Please request a new code.')
    }

    if (verification.code !== code) {
      throw new BadRequestError('Invalid verification code')
    }

    // 코드가 맞으면 성공 응답 (아직 인증 완료는 아님)
    return {
      message: 'Verification code is valid',
      verified: true,
    }
  }

  async confirmStudentVerification(
    userId: string,
    code: string,
    studentId: string,
    department: string,
    grade: number
  ) {
    const verification = this.verificationCodes.get(userId)

    if (!verification) {
      throw new BadRequestError('No verification code found. Please request a new code.')
    }

    if (verification.expiresAt < new Date()) {
      this.verificationCodes.delete(userId)
      throw new BadRequestError('Verification code has expired. Please request a new code.')
    }

    if (verification.code !== code) {
      throw new BadRequestError('Invalid verification code')
    }

    // Update user's student verification status with additional info
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isStudentVerified: true,
        studentEmail: verification.studentEmail,
        studentId,
        department,
        grade,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isStudentVerified: true,
        studentEmail: true,
        studentId: true,
        department: true,
        grade: true,
      },
    })

    // Remove verification code
    this.verificationCodes.delete(userId)

    return {
      message: 'Student verification successful',
      user,
    }
  }

  // Password Reset Methods
  private passwordResetTokens: Map<string, { email: string; expiresAt: Date }> = new Map()

  async requestPasswordReset(email: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If an account exists, a password reset link has been sent.' }
    }

    // Generate reset token (UUID format)
    const token = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Store token
    this.passwordResetTokens.set(token, { email: user.email, expiresAt })

    // Send email
    try {
      await sendPasswordResetEmail(user.email, user.name, token)
      console.log(`✅ Password reset email sent to ${user.email}`)
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error)
      // Still log the token for development
      console.log(`🔐 Password reset token for ${user.email}: ${token}`)
    }

    return { message: 'If an account exists, a password reset link has been sent.' }
  }

  async resetPassword(token: string, newPassword: string) {
    const resetData = this.passwordResetTokens.get(token)

    if (!resetData) {
      throw new BadRequestError('Invalid or expired reset token')
    }

    if (resetData.expiresAt < new Date()) {
      this.passwordResetTokens.delete(token)
      throw new BadRequestError('Reset token has expired. Please request a new one.')
    }

    // Hash new password
    const hashedPassword = await BcryptUtil.hash(newPassword)

    // Update user password
    await prisma.user.update({
      where: { email: resetData.email },
      data: { password: hashedPassword },
    })

    // Remove used token
    this.passwordResetTokens.delete(token)

    return { message: 'Password has been reset successfully' }
  }

  // Delete Account Method
  async deleteAccount(userId: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify password
    const isValid = await BcryptUtil.compare(password, user.password)
    if (!isValid) {
      throw new BadRequestError('Incorrect password')
    }

    // Delete user (cascades to reservations, orders, etc.)
    await prisma.user.delete({
      where: { id: userId },
    })

    return { message: 'Account has been deleted successfully' }
  }
}
