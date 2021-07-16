// import cors from 'cors'
import express from 'express'
import requestLogger from './logging/morgan'
import router from './routes'

const app = express()

// app.use(cors)
app.use(express.json())
app.use(requestLogger)

app.use('/', router)

export default app
