"use strict"

import { Service, ServiceBroker, Context } from "moleculer"

export default class WebhooksService extends Service {
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
        // register: {
        //   rest: "/register",
        //   params: {
        //     url: "string",
        //   },
        // },
      },
      hooks: {
        before: {
          // register: (ctx: Cont)
        },
      },
    })
  }

  // Action
  public ActionHello(): string {
    return "Hello webhooks"
  }

  public ActionWelcome(name: string): string {
    return `Welcome, ${name}`
  }
}
