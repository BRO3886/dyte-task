import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = <string>req.headers["authorization"]
  if (!authHeader) {
    return res.status(401).json({ message: "token missing" })
  }

  const token: string = authHeader.split(" ")[1]
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const { id } = <any>jwt.verify(token, process.env.SECRET_KEY!)
    res.locals.uid = id
    next()
  } catch (err) {
    return res.status(401).json({ message: "possibly malformed token" })
  }
}

export default verifyToken
