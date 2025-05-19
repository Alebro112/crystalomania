import { CustomLogger } from "#middlewares/logger/logger";
import { Transaction } from "sequelize";
import { DCurrencyDTO } from "#controllers/currency";
import ApiError from "#middlewares/exceptions/api.error";
import { DDepositDTO } from "#controllers/deposit";

export type selectAllCurrenciesFunction = (
    logger: CustomLogger,
    transaction: Transaction | null = null,
) => Promise<[Array<DCurrencyDTO>, null] | [null, ApiError]>;

export type increaseTotalByDDepositDTOFunction = (
    depositDTO: DDepositDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[number, null] | [null, ApiError]>

export type decreaseTotalByDDepositDTOFunction = (
    depositDTO: DDepositDTO,
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[number, null] | [null, ApiError]>

export type recalculateRateFunction = (
    logger: CustomLogger,
    transaction: Transaction | null = null
) => Promise<[number, null] | [null, ApiError]>