import express from "express"
import adminRouter from "./admin"

const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).json({ ping: "pong" })
})

router.use("/admin", adminRouter)

export default router
