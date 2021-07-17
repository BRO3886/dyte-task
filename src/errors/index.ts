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
export class DoesNotExistErr extends Error {
  constructor() {
    super("does not exist", 404, "errors.doesNoExist", {
      error: "That record with that ID not exist.",
    })
  }
}

export class UpdateErr extends Error {
  constructor(reason: any) {
    super("update error", 404, "errors.updateErr", reason)
  }
}

export class FetchErr extends Error {
  constructor(reason: any) {
    super("fetch error", 404, "errors.updateErr", reason)
  }
}
