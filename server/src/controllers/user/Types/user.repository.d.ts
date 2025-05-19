import { CustomLogger } from "#middlewares/logger/logger";
import { DUserDTO, DUserUnsafeDTO, RequestUserDTO } from "#controllers/user"
import ApiError from "#middlewares/exceptions/api.error";

export type selectByLoginFunction = (
    login: string,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DUserDTO, null] | [null, ApiError]>

export type selectByLoginUnsafeFunction = (
    login: string,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DUserUnsafeDTO, null] | [null, ApiError]>

export type insertUserFunction = (
    userDTO: RequestUserDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DUserDTO, null] | [null, ApiError]>