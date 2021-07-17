import { isIP } from "net"
import { Prisma, PrismaClient, Webhook } from "@prisma/client"
import { Service, ServiceBroker, Context } from "moleculer"
import ApiGatewayService from "moleculer-web"
import { v4 as uuid4 } from "uuid"
import { URL } from "url"
import { DatabaseError, UpdateErr } from "../errors"
import {
  WebhookCreateResponse,
  WebhooksListResponse,
  WebhookTriggerResponse,
} from "../src/controllers/webhook/interfaces"
import log from "../src/logging/logger"
import { SendMessage } from "../src/controllers/webhook/webhook"

export default class WebhooksService extends Service {
  db = new PrismaClient()

  public constructor(public broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: "webhooks",
      actions: {
        /**
         * Register a webhook
         */
        register: {
          rest: {
            path: "/register",
            method: "POST",
          },

          params: {
            uri: "string",
          },
          async handler(ctx: Context<{ uri: string }>): Promise<WebhookCreateResponse> {
            // @ts-ignore
            ctx.meta.$statusCode = 201
            // @ts-ignore
            return this.CreateWebhook(ctx.params.uri, ctx.meta.user.id)
          },
        },
        /**
         * Register a webhook
         */
        update: {
          rest: {
            path: "/:id/update",
            method: "PATCH",
          },

          params: {
            id: "string",
            newTargetURL: "string",
          },
          async handler(ctx: Context<{ id: string; newTargetURL: string }>): Promise<WebhookCreateResponse> {
            // @ts-ignore
            ctx.meta.$statusCode = 200
            return this.UpdateWebhook(ctx.params.id, ctx.params.newTargetURL)
          },
        },

        /**
         * List all webhooks in DB
         */
        list: {
          rest: {
            path: "/",
            method: "GET",
          },
          params: {
            own: "string",
          },
          async handler(
            ctx: Context<{ own: string }, { user: { id: string } }>
          ): Promise<WebhooksListResponse> {
            var boolOwn: boolean = this.getBool(ctx.params.own)
            return this.ListWebhooks(boolOwn, ctx.meta.user.id)
          },
        },

        trigger: {
          rest: {
            path: "/trigger",
            method: "POST",
          },
          params: {
            own: "string",
            ipAddr: "string",
          },
          async handler(
            ctx: Context<{ own: string; ipAddr: string }, { user: { id: string } }>
          ): Promise<WebhookTriggerResponse> {
            var boolOwn: boolean = this.getBool(ctx.params.own)
            return this.TriggerSend(boolOwn, ctx.meta.user.id, ctx.params.ipAddr)
          },
        },
      },
      hooks: {
        before: {
          register: (ctx: Context<{ uri: string }>) => {
            this.validateURL(ctx.params.uri)
          },
          update: (ctx: Context<{ newTargetURL: string }>) => {
            this.validateURL(ctx.params.newTargetURL)
          },
          trigger: (ctx: Context<{ ipAddr: string }, { user: { id: string } }>) => {
            this.validateIP(ctx.params.ipAddr)
          },
        },
      },
    })
  }

  public async CreateWebhook(uri: string, adminID: string): Promise<WebhookCreateResponse> {
    try {
      const created = await this.db.webhook.create({
        data: {
          url: uri,
          id: uuid4(),
          adminID: adminID,
        },
      })

      return {
        data: {
          url: created.url,
          id: created.id,
        },
      }
    } catch (err) {
      log.error(err)
      throw new DatabaseError()
    }
  }

  public async UpdateWebhook(webhookID: string, newURL: string): Promise<WebhookCreateResponse> {
    try {
      const updated = await this.db.webhook.update({
        data: {
          url: newURL,
        },
        where: {
          id: webhookID,
        },
      })

      return {
        data: { url: updated.url, id: updated.id },
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        log.error(err)
        throw new UpdateErr(err.meta)
      }

      throw new DatabaseError()
    }
  }

  public async ListWebhooks(own: boolean, adminID: string): Promise<WebhooksListResponse> {
    try {
      let q: Prisma.WebhookFindManyArgs = {}

      if (own) {
        q = {
          where: {
            adminID: adminID,
          },
          select: {
            id: true,
            url: true,
          },
        }
      } else {
        q = {
          select: {
            id: true,
            url: true,
          },
        }
      }

      const webhooks = await this.db.webhook.findMany(q)

      return {
        data: webhooks,
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        log.error(err)
        throw new UpdateErr(err.meta)
      }

      throw new DatabaseError()
    }
  }

  public async TriggerSend(own: boolean, id: string, ip: string): Promise<WebhookTriggerResponse> {
    try {
      let q: Prisma.WebhookFindManyArgs = {}

      if (own) {
        q = {
          where: {
            adminID: id,
          },
          select: {
            url: true,
          },
        }
      } else {
        q = {
          select: {
            url: true,
          },
        }
      }

      const webhooks = await this.db.webhook.findMany(q)
      const batchSize = parseInt(process.env.TRIGGER_BATCH_SIZE)

      var chunks = this.getChunks(webhooks, batchSize)

      chunks.forEach(async (arr) => {
        await SendMessage(ip, arr)
      })

      return {
        data: "sent",
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        log.error(err)
        throw new UpdateErr(err.meta)
      }

      throw new DatabaseError()
    }
  }

  private getChunks(webhooks: Array<Webhook>, batchSize: number): Array<Array<Webhook>> {
    var chunks: Array<Array<Webhook>> = [],
      i = 0,
      n = webhooks.length

    while (i < n) {
      chunks.push(webhooks.slice(i, (i += batchSize)))
    }

    return chunks
  }

  private getBool(val: string): boolean {
    let boolVal: boolean
    if (val == "true") {
      boolVal = true
    } else if (val == "false") {
      boolVal = false
    } else {
      throw new ApiGatewayService.Errors.BadRequestError("bad query param", [
        {
          message: "bad request",
          error: "'own' should be either 'true' or 'false'",
        },
      ])
    }

    return boolVal
  }

  private validateURL(url: string) {
    try {
      var _ = new URL(url)
    } catch (err) {
      throw new ApiGatewayService.Errors.BadRequestError("register webhook", [
        {
          error: "not a valid url string",
        },
      ])
    }
  }

  private validateIP(ip: string) {
    if (!isIP(ip)) {
      throw new ApiGatewayService.Errors.BadRequestError("trigger webhook", [
        {
          error: "not a valid IP address",
        },
      ])
    }
  }
}
