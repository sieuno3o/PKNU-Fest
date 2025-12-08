import api from './client'
import type { User } from '@/stores/authStore'

// 타입 정의
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  studentId: string
  department: string
  phone: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  studentId?: string
  department?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface RequestStudentVerificationRequest {
  email: string
  studentId: string
  name: string
}

export interface VerifyStudentRequest {
  token: string
}

export interface AuthResponse {
  user: User
  token: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 인증 API
export const authApi = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // 현재 사용자 정보 조회
  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  // 학생 인증 요청
  requestStudentVerification: async (
    data: RequestStudentVerificationRequest
  ): Promise<void> => {
    await api.post('/auth/verify-student', data)
  },

  // 학생 인증 확인 (이메일 토큰)
  verifyStudent: async (data: VerifyStudentRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/confirm-student', data)
    return response.data.data
  },

  // 비밀번호 재설정 요청
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/password-reset/request', { email })
  },

  // 비밀번호 재설정
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/password-reset/confirm', { token, newPassword })
  },

  // 프로필 업데이트
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/me', data)
    return response.data.data
  },

  // 비밀번호 변경
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data)
  },

  // 현재 사용자 정보 조회 (me 메서드의 별칭)
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },
}
