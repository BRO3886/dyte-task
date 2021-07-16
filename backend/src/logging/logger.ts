import winston from 'winston'
// import * as dotenv from 'dotenv'

// dotenv.config()

// var shouldLog: boolean = JSON.parse(<string>process.env.LOG_MODE)

const logger = winston.createLogger({
  // level: shouldLog ? 'silly' : 'info',
  level: 'silly',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'silly',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
})

export default logger
