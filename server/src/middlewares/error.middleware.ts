import { NextFunction, Request, Response } from 'express';

import ApiError from './exceptions/api.error';

export default function (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors });
    }

    if (req.logger) {
        req.logger.error('Not expected error', {
            func: 'error.middleware',
            error: err.stack ?? err,
        });
    } else {
        console.error('Not expected error', {
            func: 'error.middleware',
            error: err.stack ?? err,
        });
    }
    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
