import app from "./app"
import http from "http"
import log from "./logging/logger"
import * as dotenv from "dotenv"
import ApiService from "../services/api.service"
import { ServiceBroker } from "moleculer"
import brokerConfig from "../moleculer.config"
import WebhooksService from "../services/webhooks.service"

dotenv.config()

const PORT: number = Number(process.env.PORT) || 8080

log.debug(`using db: ${process.env.DB_NAME}`)

const server = http.createServer(app)

let broker = new ServiceBroker(brokerConfig)
let apiService = new ApiService(broker)
let webhooksService = new WebhooksService(broker)

server.listen(PORT, async () => {
  await apiService._start()
  await webhooksService._start()
  log.info(`server started on port ${PORT}`)
})
