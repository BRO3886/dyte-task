import morgan from 'morgan'
import log from './logger'
import { Logger } from 'winston'

const logStream = {
  write: (message: string): Logger => log.info(message),
}

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: logStream }
)

export default requestLogger
