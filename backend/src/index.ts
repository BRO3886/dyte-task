import app from './app'
import http from 'http'
import logger from './logging/logger'
import * as dotenv from 'dotenv'

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8080

logger.info(`db: ${process.env.DB_NAME}`)

const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`server started on port ${PORT}`)
})
