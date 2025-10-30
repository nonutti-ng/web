export default class APIError extends Error {
    message: string;
    code: string;
    details?: unknown;

    constructor(message: string, code: string, details?: unknown) {
        super(message);
        this.message = message;
        this.code = code;
        this.details = details;
    }
}
