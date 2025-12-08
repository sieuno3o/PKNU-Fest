import { QueryClient } from '@tanstack/react-query'

// Query Client 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
    },
    mutations: {
      // React Query v5에서는 onError가 제거되었습니다.
      // 각 mutation hook에서 개별적으로 onError 처리하세요.
    },
  },
})
