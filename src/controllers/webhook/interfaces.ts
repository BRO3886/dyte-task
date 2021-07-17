import { Webhook } from "@prisma/client"

export interface WebhookCreateResponse {
  data: {
    url: string
    id: string
  }
}
export interface WebhooksListResponse {
  data: Array<Webhook>
}
