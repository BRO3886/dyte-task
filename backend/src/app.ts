// import cors from 'cors'
import express from 'express'
import log from './logging/logger'
import requestLogger from './logging/morgan'
import router from './routes'

const app = express()

// app.use(cors)
// allow only application/json
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      log.error(err)
      return res.status(400).json({
        code: 400,
        message: 'possibly malformed body',
      })
    }

    next()
  })
})
// does the same for URL-encoded requests
app.use(express.urlencoded({ extended: true }))
// morgan
app.use(requestLogger)

app.use('/', router)

export default app
