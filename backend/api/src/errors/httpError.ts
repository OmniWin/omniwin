import { FastifyInstance } from "fastify";
export class HttpError extends Error {
    public statusCode: number;
    public fastify: FastifyInstance;

    constructor(fastify: FastifyInstance, code: string) {
        super();
        this.fastify = fastify;

        const errorInfo = this.getMessage(code);

        this.message = errorInfo.message;
        this.statusCode = errorInfo.statusCode;

    }

    private getMessage(code: string): { message: string, statusCode: number } {
        const messages: { [key: string]: { message: string, statusCode: number } } = {
            'USER_NOT_FOUND': { message: 'User not found', statusCode: 404 },
            'INVALID_CREDENTIALS': { message: 'Invalid credentials', statusCode: 401 },
            'EMAIL_IN_USE': { message: 'Email already in use', statusCode: 409 },
            'INVALID_REFRESH_TOKEN': { message: 'Invalid refresh token', statusCode: 401 },
            'AUTHENTICATION_FAILED': { message: 'Authentication failed', statusCode: 401 },
            'TOKEN_EXPIRED': { message: 'Token expired', statusCode: 401 },
            'INTERNAL_SERVER_ERROR': { message: 'Internal server error', statusCode: 500 },
            'BAD_REQUEST': { message: 'Bad request', statusCode: 400 },
            'TOKEN_REVOKED': { message: 'Token revoked', statusCode: 401 },
            'NOT_FOUND': { message: 'Not found', statusCode: 404 },
            'FORBIDDEN': { message: 'Forbidden', statusCode: 403 },
            'UNAUTHORIZED': { message: 'Unauthorized', statusCode: 401 },
            'UNPROCESSABLE_ENTITY': { message: 'Unprocessable entity', statusCode: 422 },
            'TOO_MANY_REQUESTS': { message: 'Too many requests', statusCode: 429 },
            'GONE': { message: 'Gone', statusCode: 410 },
        };

        const errorInfo = messages[code];

        this.statusCode = errorInfo?.statusCode || 500;
        this.fastify.log.error(`HttpError: ${code} - ${errorInfo?.message}`);

        return {
            message: errorInfo?.message || 'An unknown error occurred',
            statusCode: errorInfo?.statusCode || 500,
        }
    }



}