import { ServiceBroker } from "moleculer"
import ApiService from "../services/api.service"
import WebhooksService from "../services/webhooks.service"
import brokerConfig from "./config/moleculer.config"
import app from "./app"
import http from "http"
import log from "./logging/logger"
import * as dotenv from "dotenv"

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8080

log.debug(`using db: ${process.env.DB_NAME}`)

const server = http.createServer(app)
let broker = new ServiceBroker(brokerConfig)
let apiSvc = new ApiService(broker)
let webhooksSvc = new WebhooksService(broker)

server.listen(PORT, async () => {
  await apiSvc._start()
  await webhooksSvc._start()
  log.info(`server started on port ${PORT}`)
})
