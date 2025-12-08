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

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated,
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

// 통합 useAuth 훅 (기존 코드 호환성을 위해)
export function useAuth() {
  const { user, isAuthenticated } = useAuthStore()
  const { data: currentUser, isLoading } = useCurrentUser()

  const logoutMutation = useLogout()

  // 실제 사용자 정보는 API에서 가져온 것을 우선 사용
  const activeUser = currentUser || user

  return {
    user: activeUser,
    isLoading,
    isAuthenticated,
    logout: () => logoutMutation.mutate(),
    isAdmin: activeUser?.role === 'admin',
    isVendor: activeUser?.role === 'vendor',
    isUser: activeUser?.role === 'user',
    // 레거시 호환성을 위한 함수들
    login: () => {}, // 실제로는 useLogin 훅을 사용해야 함
    switchRole: () => {}, // 개발 환경에서만 사용하던 기능
  }
}
