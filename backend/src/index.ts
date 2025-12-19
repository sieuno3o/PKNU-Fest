import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

// Middleware
import { logger } from './middleware/logger.middleware'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'

// Routes
import routes from './routes'

// Socket.IO
import { setupSocketIO } from './socket'

// Firebase & Email
import { initializeFirebase } from './utils/firebase.util'
import { verifyEmailConnection } from './utils/email.util'

// Load environment variables
dotenv.config()

// Initialize Firebase
initializeFirebase()

// Verify email connection
verifyEmailConnection()

const app: Application = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

// Setup Socket.IO handlers
setupSocketIO(io)

  // Store io instance globally for use in services
  ; (global as any).io = io

const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

// API Routes
app.use('/api', routes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'PKNU-Fest API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      reservations: '/api/reservations',
      foodtrucks: '/api/foodtrucks',
      orders: '/api/orders',
      admin: '/api/admin',
      vendor: '/api/vendor',
    },
  })
})

// Error handlers (must be last)
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📡 Socket.IO is ready for connections`)
})

export { io }
