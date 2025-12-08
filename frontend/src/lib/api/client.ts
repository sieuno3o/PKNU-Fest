import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/ui/Toast'

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 에러 처리
    if (error.response) {
      const status = error.response.status
      const message = (error.response.data as any)?.message || '오류가 발생했습니다'

      switch (status) {
        case 401:
          // 인증 오류 - 로그아웃 처리
          toast.error('로그인이 필요합니다')
          useAuthStore.getState().logout()
          window.location.href = '/login'
          break

        case 403:
          toast.error('접근 권한이 없습니다')
          break

        case 404:
          toast.error('요청한 리소스를 찾을 수 없습니다')
          break

        case 500:
          toast.error('서버 오류가 발생했습니다')
          break

        default:
          toast.error(message)
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못함
      toast.error('서버와 통신할 수 없습니다')
    } else {
      // 요청 설정 중 오류 발생
      toast.error('요청 처리 중 오류가 발생했습니다')
    }

    return Promise.reject(error)
  }
)

// API 요청 헬퍼 함수들
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config)
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config)
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config)
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config)
  },
}

export default api
