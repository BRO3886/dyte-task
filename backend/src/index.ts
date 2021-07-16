import app from './app'
import http from 'http'
import logger from './logging/logger'
import * as dotenv from 'dotenv'
import db from './models'

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8080

logger.info(`db: ${process.env.DB_USER}`)

const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`server started on port ${PORT}`)
})
