import { Response, Request, NextFunction } from "express"

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = <string>req.headers["admin-key"]
  if (!adminKey || adminKey != process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "admin key missing" })
  }
  next()
}
