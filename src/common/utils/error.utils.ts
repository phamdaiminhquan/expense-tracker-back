import { AxiosError } from 'axios';

/**
 * Type-safe error extraction from Axios errors
 */
export interface ApiErrorResponse {
    message: string;
    statusCode?: number;
    error?: string;
}

export type ApiError = AxiosError<ApiErrorResponse>;

/**
 * Type guard to check if error is an Axios error
 */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof AxiosError;
}

/**
 * Extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Đã có lỗi xảy ra';
}

/**
 * Extract status code from Axios error
 */
export function getErrorStatus(error: unknown): number | undefined {
    if (isApiError(error)) {
        return error.response?.status;
    }
    return undefined;
}
