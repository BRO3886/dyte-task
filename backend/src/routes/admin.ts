import { PrismaClient } from '@prisma/client'
import express from 'express'
import AdminController from '../controllers/admin/admin'
import { ApiResponse } from '../controllers/utils'
import { ReqRes } from './interfaces'

const adminRouter = express.Router()

const db = new PrismaClient()
var admin = new AdminController(db)

type AuthReq = { username: string; password: string }
var createRoute: ReqRes<AuthReq, ApiResponse> = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    res.status(400).send({
      code: 400,
      message: 'username or password missing',
    })
    return
  }

  var response = await admin.register(username!, password!)
  res.status(response.code).send(response)
}

var loginRoute: ReqRes<AuthReq, ApiResponse> = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    res.status(400).send({
      code: 400,
      message: 'username or password missing',
    })
    return
  }

  var response = await admin.login(username!, password!)
  res.status(response.code).send(response)
}

adminRouter.post('/create', createRoute)
adminRouter.post('/login', loginRoute)

export default adminRouter
