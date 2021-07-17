import { IncomingMessage } from "http"
import { Service, ServiceBroker, Context } from "moleculer"
import ApiGateway from "moleculer-web"
import jwt from "jsonwebtoken"
import app from "../src/app"
import log from "../src/logging/logger"

export default class ApiService extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker)
    // @ts-ignore
    this.parseServiceSchema({
      name: "api",
      started: async () => {
        app.use("/api", this.express())
        app.listen(Number.parseInt(process.env.PORT) | 8000, () => {
          log.info(`started express server on ${process.env.PORT}`)
        })
      },
      mixins: [ApiGateway],
      // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
      settings: {
        server: false,
        middleware: true,
        // port: 3000,
        routes: [
          {
            path: "",
            whitelist: [
              // Access to any actions in all services under "/api" URL
              "**",
            ],
            // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
            use: [],
            // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
            mergeParams: true,

            // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
            authentication: true,

            // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
            authorization: false,

            // The auto-alias feature allows you to declare your route alias directly in your services.
            // The gateway will dynamically build the full routes from service schema.
            autoAliases: true,

            aliases: {},
            /**
					 * Before call hook. You can check the request.
					 * @param {Context} ctx
					 * @param {Object} route
					 * @param {IncomingMessage} req
					 * @param {ServerResponse} res
					 * @param {Object} data
					onBeforeCall(ctx: Context<any,{userAgent: string}>,
					 route: object, req: IncomingMessage, res: ServerResponse) {
					  Set request headers to context meta
					  ctx.meta.userAgent = req.headers["user-agent"];
					},
					 */

            /**
					 * After call hook. You can modify the data.
					 * @param {Context} ctx
					 * @param {Object} route
					 * @param {IncomingMessage} req
					 * @param {ServerResponse} res
					 * @param {Object} data
					 *
					 onAfterCall(ctx: Context, route: object, req: IncomingMessage, res: ServerResponse, data: object) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				},
					 */

            // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
            callingOptions: {},

            bodyParsers: {
              json: {
                strict: true,
                limit: "1MB",
              },
              urlencoded: {
                extended: true,
                limit: "1MB",
              },
            },

            // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
            mappingPolicy: "all", // Available values: "all", "restrict"

            // Enable/disable logging
            logging: true,
          },
        ],
        // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
        log4XXResponses: true,
        // Logging the request parameters. Set to any log level to enable it. E.g. "info"
        logRequestParams: null,
        // Logging the response data. Set to any log level to enable it. E.g. "info"
        logResponseData: null,
        // Serve assets from "public" folder
        assets: {
          folder: "public",
          // Options to `server-static` module
          options: {},
        },
        onError(req: any, res: any, err: any) {
          res.setHeader("Content-Type", "application/json")
          res.status(err.code || 500)
          res.end(
            JSON.stringify(
              err.data
                ? err.data.length > 0
                  ? err.data[0]
                  : err.data
                : { message: "something went wrong" }
            )
          )
        },
      },

      methods: {
        /**
         * Authenticate the request. It checks the `Authorization` token value in the request header.
         * Check the token value & resolve the user by the token.
         * The resolved user will be available in `ctx.meta.user`
         *
         * @param {Context} ctx
         * @param {any} route
         * @param {IncomingMessage} req
         * @returns {Promise}
         */
        async authenticate(
          ctx: Context,
          route: any,
          req: IncomingMessage
        ): Promise<any> {
          // Read the token from header
          const auth = req.headers.authorization

          if (auth && auth.startsWith("Bearer")) {
            const token = auth.slice(7)

            // Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
            try {
              const { id } = <any>jwt.verify(token, process.env.SECRET_KEY!)
              return {
                id: id,
              }
            } catch (err) {
              throw new ApiGateway.Errors.UnAuthorizedError(
                ApiGateway.Errors.ERR_INVALID_TOKEN,
                {
                  error: "Invalid Token",
                }
              )
            }
          } else {
            // No token. Throw an error or do nothing if anonymous access is allowed.
            throw new ApiGateway.Errors.UnAuthorizedError(
              ApiGateway.Errors.ERR_NO_TOKEN,
              {
                error: "Missing token",
              }
            )
          }
        },
        /**
				 * Authorize the request. Check that the authenticated user has right to access the resource.
				 *
				 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}

				async authorize (ctx: Context < any, {
					user: string;
				} > , route: Record<string, undefined>, req: IncomingMessage): Promise < any > => {
					// Get the authenticated user.
					const user = ctx.meta.user;

					// It check the `auth` property in action schema.
					// @ts-ignore
					if (req.$action.auth === "required" && !user) {
						throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", {
							error: "Unauthorized",
						});
					}
				},
				 */
      },
    })
  }
}
