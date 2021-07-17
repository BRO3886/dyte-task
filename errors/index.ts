import { Errors } from "moleculer"

class Error extends Errors.MoleculerError {
  constructor(message: string, code: number, type: string, data: any) {
    super(message, code, type, [data])
  }
}

export class DatabaseError extends Error {
  constructor() {
    super("database error", 500, "errors.datbaseError", {
      error: "uh oh, our server stalled",
    })
  }
}
