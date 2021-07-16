// import cors from 'cors'
import express from 'express'
import log from './logging/morgan'
import router from './routes'

const app = express()

// app.use(cors)
app.use(express.json())
app.use(log)

app.use('/', router)

export default app
