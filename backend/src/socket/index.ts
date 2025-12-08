import { Server as SocketIOServer, Socket } from 'socket.io'
import { JwtUtil } from '../utils/jwt.util'

export interface AuthenticatedSocket extends Socket {
  userId?: string
  userRole?: string
}

export function setupSocketIO(io: SocketIOServer) {
  // 인증 미들웨어
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]

    if (token) {
      try {
        const decoded = JwtUtil.verify(token)
        socket.userId = decoded.userId
        socket.userRole = decoded.role
        next()
      } catch (error) {
        console.log('⚠️  Socket authentication failed:', error)
        // 인증 실패해도 연결은 허용 (공개 이벤트용)
        next()
      }
    } else {
      // 토큰 없어도 연결 허용
      next()
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('✅ Client connected:', socket.id, socket.userId ? `(User: ${socket.userId})` : '')

    // Room 참여
    socket.on('join:event', (eventId: string) => {
      socket.join(`event:${eventId}`)
      console.log(`📍 Socket ${socket.id} joined event room: ${eventId}`)
    })

    socket.on('leave:event', (eventId: string) => {
      socket.leave(`event:${eventId}`)
      console.log(`👋 Socket ${socket.id} left event room: ${eventId}`)
    })

    socket.on('join:foodtruck', (foodTruckId: string) => {
      socket.join(`foodtruck:${foodTruckId}`)
      console.log(`🚚 Socket ${socket.id} joined foodtruck room: ${foodTruckId}`)
    })

    socket.on('leave:foodtruck', (foodTruckId: string) => {
      socket.leave(`foodtruck:${foodTruckId}`)
      console.log(`👋 Socket ${socket.id} left foodtruck room: ${foodTruckId}`)
    })

    // 사용자별 개인 room (주문/예약 알림용)
    if (socket.userId) {
      socket.join(`user:${socket.userId}`)
      console.log(`👤 Socket ${socket.id} joined user room: ${socket.userId}`)
    }

    // 관리자/운영자 전용 room
    if (socket.userRole === 'ADMIN') {
      socket.join('admin')
      console.log(`🔐 Socket ${socket.id} joined admin room`)
    }

    if (socket.userRole === 'VENDOR') {
      socket.join('vendor')
      console.log(`🏪 Socket ${socket.id} joined vendor room`)
    }

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
    })
  })

  return io
}

// 헬퍼 함수들
export function emitReservationUpdate(io: SocketIOServer, eventId: string, data: any) {
  io.to(`event:${eventId}`).emit('reservation:updated', data)
  io.to('admin').emit('reservation:updated', data)
}

export function emitOrderUpdate(io: SocketIOServer, order: any) {
  // 주문한 사용자에게 알림
  io.to(`user:${order.userId}`).emit('order:updated', order)

  // 푸드트럭 운영자에게 알림
  io.to(`foodtruck:${order.foodTruckId}`).emit('order:updated', order)

  // 모든 벤더에게 알림
  io.to('vendor').emit('order:updated', order)
}

export function emitEventUpdate(io: SocketIOServer, eventId: string, data: any) {
  io.to(`event:${eventId}`).emit('event:updated', data)
  io.emit('event:updated', data) // 전체에게도 브로드캐스트
}
