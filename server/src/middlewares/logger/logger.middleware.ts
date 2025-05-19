import { NextFunction, Request, Response } from "express"
import requestIp from "request-ip"

import logger from "#config/logger"
import { CustomLogger, CustomLoggerData, CustomLoggerDetails } from "./logger"

import ApiError from "#middlewares/exceptions/api.error"



export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        req.loggerData = {
            system: {
                ip: requestIp.getClientIp(req)
            },
            // user: req.user
        } as CustomLoggerData

        const customLogger = {
            sql: (message: string, args: CustomLoggerDetails) => logger.sql(message, {
                ...args,
                ...req.loggerData
            }),
            debug: (message: string, args: CustomLoggerDetails) => logger.debug(message, {
                ...args,
                ...req.loggerData
            }),
            info: (message: string, args: CustomLoggerDetails) => logger.info(message, {
                ...args,
                ...req.loggerData
            }),
            session: (message: string, args: CustomLoggerDetails) => logger.session(message, {
                ...args,
                ...req.loggerData
            }),
            admin: (message: string, args: CustomLoggerDetails) => logger.admin(message, {
                ...args,
                ...req.loggerData
            }),
            warn: (message: string, args: CustomLoggerDetails) => logger.warn(message, {
                ...args,
                ...req.loggerData
            }),
            error: (message: string, args: CustomLoggerDetails) => logger.error(message, {
                ...args,
                ...req.loggerData
            })
        } as CustomLogger

        req.logger = customLogger

        next()
    } catch (error: any) {
        logger.error("Not expected error", {func: "logger.middleware", error: error.stack})
        return next(ApiError.BadRequest("Bad Request"))
    }
}