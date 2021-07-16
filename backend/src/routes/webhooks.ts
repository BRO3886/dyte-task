import express from 'express'
import { ApiResponse } from '../controllers/utils'
import log from '../logging/logger'
import verifyToken from '../middleware/jwt'
import { ReqRes } from './interfaces'

const webhooksRouter = express.Router()

export default webhooksRouter
