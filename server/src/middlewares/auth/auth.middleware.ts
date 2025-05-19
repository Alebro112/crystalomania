//@ts-nocheck
import { NextFunction, Request, Response } from "express"

import ApiError from "#middlewares/exceptions/api.error"
import { DUserDTO } from "#controllers/user"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (!req?.session?.cookie) {
            return next(ApiError.UnauthorizedError())
        }

        if (!req?.session?.passport?.user) {
            res.clearCookie('connect.sid', { path: '/' })
            return next(ApiError.UnauthorizedError())
        }

        req.user = req.session.passport.user

        next()
    } catch (error) {
        req.logger.error("Not expected error", { func: "auth.middleware", error: error.stack })
        return next(ApiError.UnauthorizedError())
    }
}