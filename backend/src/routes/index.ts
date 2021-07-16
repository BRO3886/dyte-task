import express from 'express'
import verifyToken from '../middleware/jwt'
import adminRouter from './admin'
import webhooksRouter from './webhooks'

const router = express.Router()

router.get('/api', (req, res) => {
  res.status(200).json({ ping: 'pong' })
})

router.use('/api/v1/admin', adminRouter)
router.use('/api/v1/webhook', verifyToken, webhooksRouter)

export default router
