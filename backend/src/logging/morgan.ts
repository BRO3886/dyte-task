import morgan from 'morgan'
import logger from './logger'
import { Logger } from 'winston'

const logStream = {
  write: (message: string): Logger => logger.info(message),
}

const log = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: logStream }
)

export default log
