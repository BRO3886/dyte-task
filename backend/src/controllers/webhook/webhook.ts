import { PrismaClient } from '@prisma/client'
import log from '../../logging/logger'
import { ApiResponse } from '../utils'

interface WebhookFeatures {
  create(url: string): Promise<ApiResponse>
  list(onlyMine: boolean): Promise<ApiResponse>
  update(id: string): Promise<ApiResponse>
  delete(id: string): Promise<ApiResponse>
}

class WebhookController implements WebhookFeatures {
  db!: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  async create(url: string): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }

  async list(onlyMine: boolean): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }

  async update(id: string): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<ApiResponse> {
    throw new Error('Method not implemented.')
  }
}
