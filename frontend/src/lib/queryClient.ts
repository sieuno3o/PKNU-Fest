import { QueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/Toast'

// Query Client 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      onError: (error: any) => {
        const message = error?.response?.data?.message || '데이터를 불러오는데 실패했습니다'
        toast.error(message)
      },
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || '요청 처리에 실패했습니다'
        toast.error(message)
      },
    },
  },
})
