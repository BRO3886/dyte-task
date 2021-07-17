import { Prisma, PrismaClient } from "@prisma/client"
import { Service, ServiceBroker, Context } from "moleculer"
import ApiGatewayService from "moleculer-web"
import { v4 as uuid4 } from "uuid"
import { URL } from "url"
import { DatabaseError, DoesNotExistErr, UpdateErr } from "../errors"
import { WebhookCreateResponse } from "../src/controllers/webhook/interfaces"
import log from "../src/logging/logger"
import { where } from "sequelize"

export default class WebhooksService extends Service {
  db = new PrismaClient()

  public constructor(public broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: "webhooks",
      actions: {
        /**
         * Say a 'Hello' action.
         *
         */
        hello: {
          rest: {
            method: "GET",
            path: "/",
          },
          async handler(): Promise<string> {
            return this.ActionHello()
          },
        },

        /**
         * Welcome, a username
         */
        welcome: {
          rest: "/welcome",
          params: {
            name: "string",
          },
          async handler(ctx: Context<{ name: string }>): Promise<string> {
            return this.ActionWelcome(ctx.params.name)
          },
        },

        /**
         * Register a webhook
         */
        register: {
          rest: "POST /register",
          params: {
            uri: "string",
          },
          async handler(
            ctx: Context<{ uri: string }>
          ): Promise<WebhookCreateResponse> {
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
          rest: "PUT /:id/update",
          params: {
            id: "string",
            newTargetURL: "string",
          },
          async handler(
            ctx: Context<{ id: string; newTargetURL: string }>
          ): Promise<WebhookCreateResponse> {
            // @ts-ignore
            ctx.meta.$statusCode = 200
            return this.UpdateWebhook(ctx.params.id, ctx.params.newTargetURL)
          },
        },
      },
      hooks: {
        before: {
          register: (ctx: Context<{ uri: string }>) => {
            try {
              var _ = new URL(ctx.params.uri)
            } catch (err) {
              throw new ApiGatewayService.Errors.BadRequestError(
                "register webhook",
                [
                  {
                    error: "not a valid url string",
                  },
                ]
              )
            }
          },
          update: (ctx: Context<{ newTargetURL: string }>) => {
            try {
              var _ = new URL(ctx.params.newTargetURL)
            } catch (err) {
              throw new ApiGatewayService.Errors.BadRequestError(
                "register webhook",
                [
                  {
                    error: "not a valid url string",
                  },
                ]
              )
            }
          },
        },
      },
    })
  }

  public async CreateWebhook(
    uri: string,
    adminID: string
  ): Promise<WebhookCreateResponse> {
    try {
      const created = await this.db.webhook.create({
        data: {
          url: uri,
          id: uuid4(),
          adminID: adminID,
        },
      })

      return {
        uri: created.url,
        id: created.id,
      }
    } catch (err) {
      log.error(err)
      throw new DatabaseError()
    }
  }

  public async UpdateWebhook(
    webhookID: string,
    newURL: string
  ): Promise<WebhookCreateResponse> {
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
        uri: updated.url,
        id: updated.id,
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        log.error(err)
        throw new UpdateErr(err.meta)
      }

      throw new DatabaseError()
    }
  }

  // Action
  public ActionHello(): string {
    return "Hello webhooks"
  }

  public ActionWelcome(name: string): string {
    return `Welcome, ${name}`
  }
}
