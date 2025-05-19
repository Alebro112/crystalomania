import http from 'http'
import { Server } from 'socket.io'

import app, { sessionMiddleware } from './app'
import { connectDB, sequelize } from '#config/db'
import logger from '#config/logger'
import { registerSocketHandlers } from './sockets'
import { PORT } from '#config/env'
import { initSocket } from './sockets/io'

const server = http.createServer(app)

const io = initSocket(server)
io.engine.use(sessionMiddleware)
registerSocketHandlers(io)

async function start() {
  try {
    await connectDB()
    await sequelize.sync({ force: false })
    logger.info('📦 Database synced')

    server.listen(PORT, () => logger.info(`🚀 Server started on port ${PORT}`))
  } catch (e: any) {
    logger.error('❌ Server Error:', e.message)
    process.exit(1)
  }
}

start()
