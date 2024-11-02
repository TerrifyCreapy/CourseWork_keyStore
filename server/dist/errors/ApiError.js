"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    constructor(status, message, errors = []) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
    static badRequest(message, errors = []) {
        return new APIError(400, message, errors);
    }
    static internal(message, errors = []) {
        return new APIError(500, message);
    }
    static forbidden(message, errors = []) {
        return new APIError(403, message);
    }
    static notFound(message, errors = []) {
        return new APIError(404, message);
    }
    static notAutorized() {
        return new APIError(401, "User is no authorized");
    }
}
exports.default = APIError;
