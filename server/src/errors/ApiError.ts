class APIError extends Error {
    status;
    errors;
    constructor(status: number, message: string, errors: [] = []) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    static badRequest(message: string, errors:[] = []): APIError {
        return new APIError(400, message, errors);
    }
    static internal(message: string, errors:[] = []): APIError {
        return new APIError(500, message);
    }
    static forbidden(message: string, errors:[] = []): APIError {
        return new APIError(403, message);
    }
    static notFound(message: string, errors:[] = []): APIError {
        return new APIError(404, message);
    }
    static notAutorized(): APIError {
        return new APIError(401, "User is no authorized")
    }
}

export default APIError;