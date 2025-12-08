import { useEffect, useState } from 'react'
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/stores/authStore'

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket()
      setIsConnected(false)
      return
    }

    const socket = getSocket()

    const handleConnect = () => {
      console.log('Socket connected')
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    connectSocket()

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      disconnectSocket()
    }
  }, [isAuthenticated])

  return { isConnected, socket: getSocket() }
}

// 특정 이벤트를 구독하는 훅
export function useSocketEvent<T = any>(eventName: string, handler: (data: T) => void) {
  useEffect(() => {
    const socket = getSocket()

    socket.on(eventName, handler)

    return () => {
      socket.off(eventName, handler)
    }
  }, [eventName, handler])
}

// 예약 이벤트 구독
export function useReservationEvents(
  onUpdate?: (data: any) => void
) {
  useEffect(() => {
    if (!onUpdate) return

    const socket = getSocket()

    socket.on('reservation:updated', onUpdate)

    return () => {
      socket.off('reservation:updated', onUpdate)
    }
  }, [onUpdate])
}

// 주문 이벤트 구독
export function useOrderEvents(
  onUpdate?: (data: any) => void
) {
  useEffect(() => {
    if (!onUpdate) return

    const socket = getSocket()

    socket.on('order:updated', onUpdate)

    return () => {
      socket.off('order:updated', onUpdate)
    }
  }, [onUpdate])
}

// 행사 이벤트 구독
export function useEventEvents(
  onUpdate?: (data: any) => void
) {
  useEffect(() => {
    if (!onUpdate) return

    const socket = getSocket()

    socket.on('event:updated', onUpdate)

    return () => {
      socket.off('event:updated', onUpdate)
    }
  }, [onUpdate])
}
