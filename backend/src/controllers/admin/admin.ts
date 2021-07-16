import bcrypt from 'bcryptjs'
import { v4 as uuid4 } from 'uuid'
import * as jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'
import log from '../../logging/logger'
import { ApiResponse } from '../utils'

interface AdminFeatures {
  register(username: string, password: string): Promise<ApiResponse>
  login(username: string, password: string): Promise<ApiResponse>
}

class AdminController implements AdminFeatures {
  db!: PrismaClient
  constructor(db: PrismaClient) {
    this.db = db
  }

  async login(username: string, password: string): Promise<ApiResponse> {
    try {
      const exists = await this.db.admin.findUnique({
        where: {
          username: username,
        },
      })
      if (!exists) {
        return {
          code: 404,
          message: 'User does not exist',
        }
      }

      const match = await bcrypt.compare(password, exists.password)
      if (!match) {
        return {
          code: 401,
          message: 'Incorrect username or password combination',
        }
      }

      const token = jwt.sign(
        {
          id: exists.id,
        },
        process.env.SECRET_KEY!
      )

      return {
        code: 200,
        message: 'logged in',
        data: {
          id: exists.id,
          token: token,
        },
      }
    } catch (err) {
      return handleError(err)
    }
  }

  async register(username: string, password: string): Promise<ApiResponse> {
    try {
      const exists = await this.db.admin.findUnique({
        where: {
          username: username,
        },
      })
      if (exists) {
        return {
          code: 409,
          message: 'User already exists',
        }
      }

      const salt = await bcrypt.genSalt(
        parseInt(<string>process.env.SALT_ROUNDS)
      )

      const pwd = await bcrypt.hash(password, salt)

      const user = {
        id: uuid4(),
        username: username,
        password: pwd,
      }

      const admin = await this.db.admin.create({ data: user })

      return {
        code: 201,
        message: 'Admin created',
        data: {
          id: admin.id,
          username: admin.username,
        },
      }
    } catch (err) {
      return handleError(err)
    }
  }
}

function handleError(err: any): ApiResponse {
  log.error(err)
  return {
    code: 500,
    message: 'something went wrong',
    data: {
      error: err.toString(),
    },
  }
}

export default AdminController
