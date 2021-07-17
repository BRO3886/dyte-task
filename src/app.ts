// import cors from 'cors'
import * as dotenv from "dotenv"
import express from "express"
import log from "./logging/logger"
import requestLogger from "./logging/morgan"
import { checkAdmin } from "./middleware/admin"
import router from "./routes"

dotenv.config()

const app = express()

// app.use(cors)
// allow only application/json
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      log.error(err)
      return res.status(422).json({
        code: 422,
        message: "possibly malformed body",
      })
    }

    next()
  })
})

app.use(checkAdmin)
// does the same for URL-encoded requests
app.use(express.urlencoded({ extended: true }))
// morgan
app.use(requestLogger)

//router
app.use("/api", router)

export default app
