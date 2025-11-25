import prisma from '../utils/prisma'
import { BcryptUtil } from '../utils/bcrypt.util'
import { JwtUtil, JwtPayload } from '../utils/jwt.util'
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/error.util'
import { RegisterInput, LoginInput } from '../utils/validation.schemas'

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
        role: 'STUDENT', // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
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
        role: user.role,
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
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
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
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return updatedUser
  }
}
