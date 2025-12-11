import prisma from '../utils/prisma'
import { BcryptUtil } from '../utils/bcrypt.util'
import { JwtUtil, JwtPayload } from '../utils/jwt.util'
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/error.util'
import { RegisterInput, LoginInput } from '../utils/validation.schemas'
import { sendStudentVerificationEmail } from '../utils/email.util'

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

  async confirmStudentVerification(userId: string, code: string) {
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

    // Update user's student verification status
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isStudentVerified: true,
        studentEmail: verification.studentEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isStudentVerified: true,
        studentEmail: true,
      },
    })

    // Remove verification code
    this.verificationCodes.delete(userId)

    return {
      message: 'Student verification successful',
      user,
    }
  }
}
