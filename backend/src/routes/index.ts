import express from 'express'
import adminRouter from './admin'

const router = express.Router()

router.get('/api', (req, res) => {
  res.status(200).json({ ping: 'pong' })
})

router.use('/api/v1/admin', adminRouter)

export default router
