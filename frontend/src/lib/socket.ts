import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/authStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    const token = useAuthStore.getState().token

    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: false,
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }

  return socket
}

export const connectSocket = () => {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}

// Room 참여 헬퍼 함수들
export const joinEventRoom = (eventId: string) => {
  const socket = getSocket()
  socket.emit('join:event', eventId)
}

export const leaveEventRoom = (eventId: string) => {
  const socket = getSocket()
  socket.emit('leave:event', eventId)
}

export const joinFoodTruckRoom = (foodTruckId: string) => {
  const socket = getSocket()
  socket.emit('join:foodtruck', foodTruckId)
}

export const leaveFoodTruckRoom = (foodTruckId: string) => {
  const socket = getSocket()
  socket.emit('leave:foodtruck', foodTruckId)
}

export default {
  getSocket,
  connectSocket,
  disconnectSocket,
  joinEventRoom,
  leaveEventRoom,
  joinFoodTruckRoom,
  leaveFoodTruckRoom,
}
