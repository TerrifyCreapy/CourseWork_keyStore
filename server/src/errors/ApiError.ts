class APIError extends Error {
    status;
    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message: string): APIError {
        return new APIError(404, message);
    }
    static internal(message: string): APIError {
        return new APIError(500, message);
    }
    static forbidden(message: string): APIError {
        return new APIError(403, message);
    }
}

export default APIError;