import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  RequestStudentVerificationRequest,
  VerifyStudentRequest,
} from '@/lib/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/ui/Toast'

// 타입 re-export (기존 코드 호환성을 위해)
export type { User, UserRole } from '@/stores/authStore'

// 현재 사용자 정보 조회
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser()
      } catch (error: any) {
        // 인증 실패 시 로그아웃 처리
        if (error?.response?.status === 401) {
          logout()
        }
        throw error
      }
    },
    enabled: isAuthenticated,
    retry: false, // 인증 실패 시 재시도 안 함
  })
}

// 로그인
export function useLogin() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(response.user, response.token)
      toast.success('로그인되었습니다')
    },
    onError: () => {
      toast.error('로그인에 실패했습니다')
    },
  })
}

// 회원가입
export function useRegister() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      login(response.user, response.token)
      toast.success('회원가입이 완료되었습니다')
    },
    onError: () => {
      toast.error('회원가입에 실패했습니다')
    },
  })
}

// 로그아웃
export function useLogout() {
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear() // 모든 쿼리 캐시 삭제
      toast.success('로그아웃되었습니다')
    },
  })
}

// 프로필 수정
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      // 스토어의 사용자 정보도 업데이트
      const updateUser = useAuthStore.getState().login
      const token = useAuthStore.getState().token
      if (token) {
        updateUser(user, token)
      }
      toast.success('프로필이 수정되었습니다')
    },
  })
}

// 비밀번호 변경
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다')
    },
  })
}

// 비밀번호 재설정 요청
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || '이메일 전송에 실패했습니다'
      toast.error(message)
    },
  })
}

// 비밀번호 재설정
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('비밀번호가 재설정되었습니다')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || '비밀번호 재설정에 실패했습니다'
      toast.error(message)
    },
  })
}

// 학생 인증 요청
export function useRequestStudentVerification() {
  return useMutation({
    mutationFn: (data: RequestStudentVerificationRequest) =>
      authApi.requestStudentVerification(data),
    onSuccess: () => {
      toast.success('인증 코드가 이메일로 전송되었습니다')
    },
  })
}

// 인증 코드 검증 (학생 정보 입력 전 단계)
export function useVerifyCode() {
  return useMutation({
    mutationFn: (code: string) => authApi.verifyCode(code),
  })
}

// 학생 인증 확인
export function useVerifyStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifyStudentRequest) => authApi.verifyStudent(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      // 스토어의 사용자 정보 업데이트
      const updateUser = useAuthStore.getState().login
      const token = useAuthStore.getState().token
      if (token) {
        updateUser(user, token)
      }
      toast.success('학생 인증이 완료되었습니다')
    },
  })
}

// 회원 탈퇴
export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: (password: string) => authApi.deleteAccount(password),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('회원 탈퇴가 완료되었습니다')
    },
    onError: () => {
      toast.error('비밀번호가 일치하지 않습니다')
    },
  })
}

// 통합 useAuth 훅 (기존 코드 호환성을 위해)
export function useAuth() {
  const { user, isAuthenticated } = useAuthStore()
  const { data: currentUser, isLoading } = useCurrentUser()
  const updateUser = useAuthStore((state) => state.updateUser)

  const logoutMutation = useLogout()

  // 실제 사용자 정보는 API에서 가져온 것을 기본으로 하되,
  // 로컬 스토어의 role을 우선 사용 (역할 전환 기능 지원)
  const activeUser = currentUser
    ? { ...currentUser, role: user?.role || currentUser.role }
    : user

  const switchRole = (role: 'user' | 'admin' | 'vendor') => {
    // 개발 환경에서만 역할 전환 허용 (테스트 목적)
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
      updateUser({ role })
    }
  }

  return {
    user: activeUser,
    isLoading,
    isAuthenticated,
    logout: () => logoutMutation.mutate(),
    isAdmin: activeUser?.role === 'admin',
    isVendor: activeUser?.role === 'vendor',
    isUser: activeUser?.role === 'user',
    // 레거시 호환성을 위한 함수들
    login: () => { }, // 실제로는 useLogin 훅을 사용해야 함
    switchRole,
  }
}
