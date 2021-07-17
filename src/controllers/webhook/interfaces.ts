export interface WebhookCreateResponse {
  uri: string
  id: string
}
export interface WebhooksListResponse {
  data: Array<WebhookCreateResponse>
}
