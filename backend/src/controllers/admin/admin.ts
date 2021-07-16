import bcrypt from 'bcryptjs'
import { v4 as uuid4 } from 'uuid'
import { PrismaClient } from '@prisma/client'
import log from '../../logging/logger'
import { ApiResponse } from '../utils'

interface AdminFeatures {
  register(username: string, password: string): Promise<ApiResponse>
}

class AdminController implements AdminFeatures {
  db!: PrismaClient
  constructor(db: PrismaClient) {
    this.db = db
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
      log.error(err)
      return {
        code: 500,
        message: 'not lgtm',
      }
    }
  }
}

export default AdminController
