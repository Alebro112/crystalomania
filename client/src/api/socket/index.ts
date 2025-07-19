import { io, Socket } from 'socket.io-client'
import { BASE_URL_SOCKET } from '@/api/index'

let socket: Socket | null = null

const createSocket = (url: string): Socket => {
  const instance = io(url, {
    withCredentials: true,
    transports: ['websocket'],
  })

  instance.on('connect', () => {
    console.log('🔌 Socket connected', instance.id)
  })

  instance.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected: ${reason}`)
  })

  return instance
}

/**
 * Инициализирует или возвращает уже подключённый socket.io клиент
 */
export const connectSocket = (url: string = BASE_URL_SOCKET): Socket => {
  if (!socket || socket.disconnected) {
    socket = createSocket(url)
  }

  return socket
}

/**
 * Возвращает текущий сокет-инстанс (ошибка, если не инициализирован)
 */
export const getSocket = (): Socket => {
  if (!socket) {
    return connectSocket()
  }

  return socket
}
