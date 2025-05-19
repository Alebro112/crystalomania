import { CustomLogger } from "#middlewares/logger/logger";
import { DUserDTO, RequestLoginDTO, RequestUserDTO } from "#controllers/user"
import ApiError from "#middlewares/exceptions/api.error";
import { Request } from "express";

export type createUserFunction = (
    userDTO: RequestUserDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DUserDTO, null] | [null, ApiError]>

export type loginFunction = (
    userDTO: RequestLoginDTO, 
    logger: CustomLogger
) => Promise<[DUserDTO, null] | [null, ApiError]>

export type hashPasswordFunction = (password: string) => string