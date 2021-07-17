import { Webhook } from "@prisma/client"
import axios from "axios"
import log from "../../logging/logger"

const getUnixTimeStamp = () => Math.floor(new Date().getTime() / 1000)

export const SendMessage = async (msg: string, webhooks: Webhook[]) => {
  //filter unique
  let list = new Set(webhooks)

  let ts = getUnixTimeStamp()

  const reqList = [...list].map(
    (webhook) => () =>
      axios.post(webhook.url, {
        content: JSON.stringify({ ip: msg, ts: ts }),
      })
  )

  const respList = await Promise.all(reqList.map((req) => req()))
  log.info(`sent ${respList.filter((val) => val.status == 204).length}`)
}
