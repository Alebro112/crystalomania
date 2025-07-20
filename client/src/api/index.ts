import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { ApiErrorResponse, ApiResult } from './types';
import { ZodBackendError, zodBackendErrorSchema } from './DTO/ZodError';
import { z, ZodError } from 'zod';

export const BASE_URL_SOCKET = 'https://piligrim-games.eu/bombordiri/api';
export const BASE_URL = 'https://piligrim-games.eu/bombordiri/api/api';

const $api = axios.create({
    withCredentials: true,
});

// --- Обработка запроса (можно расширить позже) ---
const onRequest = (
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
};

$api.interceptors.request.use(onRequest, onRequestError);

// --- Общая обработка ошибок ---
export function handleApiError(error: unknown): ApiErrorResponse {
    const fallbackError: ApiErrorResponse = {
        success: false,
        type: 'network',
        message: 'Ошибка сети или сервера',
    };

    if ((!axios.isAxiosError(error) || !error.response)) {
        return fallbackError;
    }

    const data = error.response.data;
    const parsed = zodBackendErrorSchema.safeParse(data);

    if (parsed.success) {
        return {
            success: false,
            type: 'zod',
            errors: parsed.data.errors,
        };
    }

    return {
        success: false,
        type: 'message',
        message: (data as any)?.message ?? 'Неизвестная ошибка',
    };
}

export function handleValidationError(error: ZodError): ApiErrorResponse {
    const data = {
        errors: {
            name: error.name,
            issues: error.errors.map((err) => ({
                path: err.path.filter(f => typeof f === 'string'),
                message: err.message,
            })),
        },
    } as ZodBackendError;
    const parsed = zodBackendErrorSchema.safeParse(data);

    if (parsed.success) {
        return {
            success: false,
            type: 'zod',
            errors: parsed.data.errors,
        } as ApiErrorResponse;
    }

    return handleApiError(null)
}

// // --- Перехватчик ответа ---
// $api.interceptors.response.use(
//     (res) => res,
//     async (error: AxiosError): Promise<never> => {
//         throw handleApiError(error);
//     },
// );

// --- Обёртка над запросами ---
export const apiRequest = async <T>(
    cb: () => Promise<AxiosResponse>,
    schema?: z.ZodType<T>,
): Promise<ApiResult<T> | ApiErrorResponse> => {
    try {
        const res = await cb();

        if (schema) {
            const parsed = schema.safeParse(res.data);
            if (!parsed.success) {
                return handleValidationError(parsed.error);
            }

            return { success: true, data: parsed.data };
        }

        return { success: true, data: res.data };
    } catch (err: any) {
        return handleApiError(err);
    }
};

export default $api;
