import { PrismaClient } from '@prisma/client'
import express from 'express'
import AdminController from '../controllers/admin/admin'
import { ApiResponse } from '../controllers/utils'
import { ReqRes } from './interfaces'

const adminRouter = express.Router()

const db = new PrismaClient()
var admin = new AdminController(db)

type AdminCreateReq = { username: string; password: string }
var createRoute: ReqRes<AdminCreateReq, ApiResponse> = async (req, res) => {
  var response = await admin.register(req.body.username!, req.body.password!)
  res.status(response.code).send(response)
}

adminRouter.post('/create', createRoute)

export default adminRouter
