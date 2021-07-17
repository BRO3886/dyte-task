"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchErr = exports.UpdateErr = exports.DoesNotExistErr = exports.DatabaseError = void 0;
const moleculer_1 = require("moleculer");
class Error extends moleculer_1.Errors.MoleculerError {
    constructor(message, code, type, data) {
        super(message, code, type, [data]);
    }
}
class DatabaseError extends Error {
    constructor() {
        super("database error", 500, "errors.datbaseError", {
            error: "uh oh, our server stalled",
        });
    }
}
exports.DatabaseError = DatabaseError;
class DoesNotExistErr extends Error {
    constructor() {
        super("does not exist", 404, "errors.doesNoExist", {
            error: "That record with that ID not exist.",
        });
    }
}
exports.DoesNotExistErr = DoesNotExistErr;
class UpdateErr extends Error {
    constructor(reason) {
        super("update error", 404, "errors.updateErr", reason);
    }
}
exports.UpdateErr = UpdateErr;
class FetchErr extends Error {
    constructor(reason) {
        super("fetch error", 404, "errors.updateErr", reason);
    }
}
exports.FetchErr = FetchErr;
//# sourceMappingURL=index.js.map