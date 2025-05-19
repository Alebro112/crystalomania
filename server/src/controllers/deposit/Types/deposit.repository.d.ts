import { DDepositDTO, RequestDepositDTO } from "#controllers/deposit";
import { DepositStatusEnum } from "#controllers/deposit/Types"
import ApiError from "#middlewares/exceptions/api.error";
import { CustomLogger } from "#middlewares/logger/logger";
import { Transaction } from "sequelize";

export type selectDepositsFunction = (
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[Array<DDepositDTO>, null] | [null, ApiError]>

export type selectDepositByIdFunction = (
    id: number,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DDepositDTO, null] | [null, ApiError]>

export type insertDepositFunction = (
    depositDTO: RequestDepositDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DDepositDTO, null] | [null, ApiError]>

export type updateDepositStatusFunction = (
    id: number,
    status: DepositStatusEnum,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[DDepositDTO, null] | [null, ApiError]>