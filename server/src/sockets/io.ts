import { Server } from 'socket.io'
import http from 'http'

let io: Server

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: (process.env.CORS_URL || '').split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    }
  })
  return io
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized!')
  }
  return io
}