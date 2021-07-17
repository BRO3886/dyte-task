import { Webhook } from "@prisma/client"
import axios from "axios"
import log from "../../logging/logger"

const getUnixTimeStamp = () => Math.floor(new Date().getTime() / 1000)

interface item {
  url: string
  retries: number
  sent: boolean
}

const getURLs = (webhooks: Webhook[]) => {
  const items: Array<item> = []
  webhooks.forEach((hook) => {
    items.push({
      url: hook.url,
      retries: 0,
      sent: true,
    })
  })

  return items
}

export const SendMessage = async (msg: string, webhooks: Webhook[]) => {
  //filter unique
  let temp = new Set(webhooks)
  let list = getURLs([...temp])

  let ts = getUnixTimeStamp()

  const reqList = [...list].map(
    (webhook) => () =>
      axios.post(webhook.url, {
        //TODO: discord testing - remove later
        content: JSON.stringify({ ip: msg, ts: ts }),
      })
  )

  //retry logic
  axios.interceptors.response.use(null, (error) => {
    if ((error.config && error.response.status != 200) || error.response.status != 204) {
      return axios.request(error.config)
    }
  })

  await Promise.all(
    reqList.map((req, idx) => {
      req()
        //TODO: remove later
        .then((res) => {
          log.info(res.status)
        })
        .catch((err) => {
          log.error(err.response.status)
          list[idx].sent = false
          if (list[idx].retries < 5) {
            list[idx].retries++
            // TODO: write retry logic
          }
        })
    })
  )

  let notSent = list.filter((item) => item.sent == false)

  log.info(`not sent ${notSent.length}`)

  //204 for discord testing. TODO: change to 200
  log.info(`sent `)
}
