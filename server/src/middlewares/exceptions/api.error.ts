export default class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: any = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Unauthorized')
    }

    static BadRequest(message: string = 'Bad Request', errors: any = []) {
        return new ApiError(400, message, errors)
    }

    static NotFound(message: string, errors: any = []) {
        return new ApiError(404, message, errors)
    }

    static ServerError(message: string = 'Server Error', errors: any = []) {
        return new ApiError(500, message, errors)
    }

    static Forbidden(message: string = 'Forbidden') {
        return new ApiError(403, message)
    }
}