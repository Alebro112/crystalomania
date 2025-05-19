import { CorsOptions } from 'cors';
import { CORS_ORIGIN } from '#config/env';

export const corsOptions: CorsOptions = {
    credentials: true,
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
};
