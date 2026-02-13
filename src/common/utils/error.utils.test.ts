import { describe, it, expect, vi } from 'vitest';
import { getErrorMessage, getErrorStatus, isApiError } from '@/common/utils/error.utils';
import { AxiosError } from 'axios';

describe('error.utils', () => {
    describe('isApiError', () => {
        it('should return true for AxiosError', () => {
            const axiosError = new AxiosError('Test error');
            expect(isApiError(axiosError)).toBe(true);
        });

        it('should return false for regular Error', () => {
            const error = new Error('Test error');
            expect(isApiError(error)).toBe(false);
        });

        it('should return false for unknown types', () => {
            expect(isApiError('string error')).toBe(false);
            expect(isApiError(null)).toBe(false);
            expect(isApiError(undefined)).toBe(false);
        });
    });

    describe('getErrorMessage', () => {
        it('should extract message from AxiosError response', () => {
            const axiosError = new AxiosError('Network Error');
            // @ts-expect-error - mocking response
            axiosError.response = {
                data: { message: 'Lỗi từ API' },
                status: 400,
            };

            expect(getErrorMessage(axiosError)).toBe('Lỗi từ API');
        });

        it('should fallback to AxiosError message if no response message', () => {
            const axiosError = new AxiosError('Network Error');
            expect(getErrorMessage(axiosError)).toBe('Network Error');
        });

        it('should extract message from regular Error', () => {
            const error = new Error('Regular error message');
            expect(getErrorMessage(error)).toBe('Regular error message');
        });

        it('should return default message for unknown types', () => {
            expect(getErrorMessage('string')).toBe('Đã có lỗi xảy ra');
            expect(getErrorMessage(null)).toBe('Đã có lỗi xảy ra');
        });
    });

    describe('getErrorStatus', () => {
        it('should extract status from AxiosError', () => {
            const axiosError = new AxiosError('Error');
            // @ts-expect-error - mocking response
            axiosError.response = { status: 404 };

            expect(getErrorStatus(axiosError)).toBe(404);
        });

        it('should return undefined for non-AxiosError', () => {
            expect(getErrorStatus(new Error('test'))).toBeUndefined();
            expect(getErrorStatus('string')).toBeUndefined();
        });
    });
});
